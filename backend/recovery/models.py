from django.db import models

class Transaction(models.Model):
    transaction_id = models.CharField(max_length=50, unique=True)
    customer_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, default='UPI')
    failure_reason = models.CharField(max_length=100, blank=True, null=True)
    retry_count = models.IntegerField(default=0)
    customer_segment = models.CharField(max_length=20, default='Regular')   
    customer_history = models.CharField(max_length=50, default='Regular Customer') 
    recovery_score = models.IntegerField(default=0)
    priority = models.CharField(max_length=20, default='medium')
    recommended_action = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, default='failed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_id} - {self.customer_name}"

class AuditLog(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} - {self.status}"

class RecoveryResult(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    is_recovered = models.BooleanField(default=False)
    amount_recovered = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    action_taken = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction.transaction_id} - {'Recovered' if self.is_recovered else 'Failed'}"