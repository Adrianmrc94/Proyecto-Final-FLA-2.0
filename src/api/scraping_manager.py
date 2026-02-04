"""
Sistema de gestión de tareas de scraping en segundo plano
"""
import uuid
import threading
from datetime import datetime

# Almacenamiento en memoria de los trabajos de scraping
scraping_jobs = {}
jobs_lock = threading.Lock()

class ScrapingJob:
    """Representa un trabajo de scraping en progreso"""
    
    def __init__(self, postal_code, user_id):
        self.job_id = str(uuid.uuid4())
        self.postal_code = postal_code
        self.user_id = user_id
        self.status = 'pending'  # pending, running, completed, error
        self.progress = 0  # 0-100
        self.total_products = 0
        self.current_products = 0
        self.message = 'Iniciando scraping...'
        self.error = None
        self.created_at = datetime.utcnow()
        self.completed_at = None
        
    def update_progress(self, current, total, message=None):
        """Actualiza el progreso del scraping"""
        self.current_products = current
        self.total_products = total
        if total > 0:
            self.progress = int((current / total) * 100)
        if message:
            self.message = message
            
    def set_running(self):
        """Marca el trabajo como en ejecución"""
        self.status = 'running'
        self.message = 'Descargando productos de Mercadona...'
        
    def set_completed(self, total_products):
        """Marca el trabajo como completado"""
        self.status = 'completed'
        self.progress = 100
        self.total_products = total_products
        self.current_products = total_products
        self.message = f'Scraping completado: {total_products} productos descargados'
        self.completed_at = datetime.utcnow()
        
    def set_error(self, error_message):
        """Marca el trabajo como fallido"""
        self.status = 'error'
        self.error = error_message
        self.message = f'Error: {error_message}'
        self.completed_at = datetime.utcnow()
        
    def to_dict(self):
        """Convierte el trabajo a diccionario para JSON"""
        return {
            'job_id': self.job_id,
            'postal_code': self.postal_code,
            'status': self.status,
            'progress': self.progress,
            'total_products': self.total_products,
            'current_products': self.current_products,
            'message': self.message,
            'error': self.error,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


def create_job(postal_code, user_id):
    """Crea un nuevo trabajo de scraping"""
    job = ScrapingJob(postal_code, user_id)
    
    with jobs_lock:
        scraping_jobs[job.job_id] = job
    
    return job


def get_job(job_id):
    """Obtiene un trabajo de scraping por ID"""
    with jobs_lock:
        return scraping_jobs.get(job_id)


def update_job_progress(job_id, current, total, message=None):
    """Actualiza el progreso de un trabajo"""
    job = get_job(job_id)
    if job:
        job.update_progress(current, total, message)


def cleanup_old_jobs(max_age_hours=24):
    """Limpia trabajos antiguos completados"""
    from datetime import timedelta
    
    with jobs_lock:
        now = datetime.utcnow()
        jobs_to_remove = []
        
        for job_id, job in scraping_jobs.items():
            if job.completed_at:
                age = now - job.completed_at
                if age > timedelta(hours=max_age_hours):
                    jobs_to_remove.append(job_id)
        
        for job_id in jobs_to_remove:
            del scraping_jobs[job_id]
    
    return len(jobs_to_remove)
