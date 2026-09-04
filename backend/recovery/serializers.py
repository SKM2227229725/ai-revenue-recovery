from rest_framework import serializers
from .models import Transaction, AuditLog, RecoveryResult

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'

class RecoveryResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryResult
        fields = '__all__'