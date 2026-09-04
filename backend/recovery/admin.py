from django.contrib import admin
from .models import Transaction, AuditLog, RecoveryResult

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'customer_name', 'amount', 'status', 'priority', 'created_at']
    list_filter = ['status', 'priority', 'payment_method']
    search_fields = ['transaction_id', 'customer_name']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['transaction', 'action', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['action', 'details']

@admin.register(RecoveryResult)
class RecoveryResultAdmin(admin.ModelAdmin):
    list_display = ['transaction', 'is_recovered', 'amount_recovered', 'action_taken', 'created_at']
    list_filter = ['is_recovered']