from django.urls import path
from . import views

urlpatterns = [
    path('metrics/', views.get_metrics, name='metrics'),
    path('transactions/', views.get_transactions, name='transactions'),
    path('run/', views.run_recovery, name='run_recovery'),
    path('audit/', views.get_audit_logs, name='audit'),
    path('ai/analyze/<int:id>/', views.analyze_transaction, name='analyze'),
]