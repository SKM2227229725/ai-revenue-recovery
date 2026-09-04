from django.core.management.base import BaseCommand
from recovery.models import Transaction, AuditLog, RecoveryResult

class Command(BaseCommand):
    help = 'Seed sample data'

    def handle(self, *args, **kwargs):
        # Create sample transactions
        samples = [
            {'id': 'TXN001', 'name': 'Rahul Sharma', 'amount': 2499, 'reason': 'insufficient_funds', 'score': 78, 'priority': 'high', 'action': 'send_reminder'},
            {'id': 'TXN002', 'name': 'Priya Patel', 'amount': 1899, 'reason': 'card_expired', 'score': 92, 'priority': 'high', 'action': 'update_payment'},
            {'id': 'TXN003', 'name': 'Amit Kumar', 'amount': 599, 'reason': 'network_timeout', 'score': 45, 'priority': 'medium', 'action': 'retry'},
            {'id': 'TXN004', 'name': 'Sneha Reddy', 'amount': 12500, 'reason': 'bank_declined', 'score': 85, 'priority': 'high', 'action': 'escalate'},
            {'id': 'TXN005', 'name': 'Vikram Singh', 'amount': 999, 'reason': 'auth_timeout', 'score': 55, 'priority': 'medium', 'action': 'retry'},
        ]

        for data in samples:
            tx, created = Transaction.objects.get_or_create(
                transaction_id=data['id'],
                defaults={
                    'customer_name': data['name'],
                    'amount': data['amount'],
                    'failure_reason': data['reason'],
                    'recovery_score': data['score'],
                    'priority': data['priority'],
                    'recommended_action': data['action'],
                }
            )
            if created:
                self.stdout.write(f"Created: {tx}")

        self.stdout.write(self.style.SUCCESS('Sample data seeded successfully!'))