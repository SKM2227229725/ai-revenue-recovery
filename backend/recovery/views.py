from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Transaction, AuditLog, RecoveryResult
from .serializers import TransactionSerializer, AuditLogSerializer
from .ai_agent import RecoveryAgent

# Initialize AI Agent (singleton)
agent = RecoveryAgent()

@api_view(['GET'])
def get_metrics(request):
    """Dashboard metrics from database"""
    total = Transaction.objects.count()
    failed = Transaction.objects.filter(status='failed').count()
    recovered = Transaction.objects.filter(status='recovered').count()
    
    # Calculate total at risk and recovered
    total_at_risk = sum(t.amount for t in Transaction.objects.filter(status='failed'))
    total_recovered = sum(t.amount for t in Transaction.objects.filter(status='recovered'))
    
    return Response({
        'totalAtRisk': float(total_at_risk),
        'recovered': float(total_recovered),
        'recoveryRate': round((recovered / total * 100) if total > 0 else 0, 1),
        'activeCases': failed,
        'totalTransactions': total,
        'failedTransactions': failed,
        'timeline': [
            {'date': 'Aug 24', 'recovered': 2400, 'atRisk': 15000},
            {'date': 'Aug 25', 'recovered': 3800, 'atRisk': 12000},
            {'date': 'Aug 26', 'recovered': 4200, 'atRisk': 11000},
            {'date': 'Aug 27', 'recovered': 5100, 'atRisk': 9800},
            {'date': 'Aug 28', 'recovered': 4900, 'atRisk': 8500},
            {'date': 'Aug 29', 'recovered': 5700, 'atRisk': 7200},
        ],
        'actionDistribution': [
            {'name': 'Retry', 'value': 44.4},
            {'name': 'Update Link', 'value': 37.5},
            {'name': 'Escalate', 'value': 18.1}
        ]
    })

@api_view(['GET'])
def get_transactions(request):
    """Get all transactions"""
    transactions = Transaction.objects.all()
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def run_recovery(request):
    """
    Run AI recovery on selected transactions
    Uses AI Agent with ML + Claude
    """
    transaction_ids = request.data.get('transactionIds', [])
    
    results = []
    for tx_id in transaction_ids:
        tx = get_object_or_404(Transaction, id=tx_id)
        
        # AI Agent analyzes the transaction
        result = agent.execute_recovery(tx)
        
        results.append({
            'id': tx.id,
            'transaction_id': tx.transaction_id,
            'recovered': result['success'],
            'amount': result['amount_recovered'],
            'action': result['action'],
            'priority_score': result['priority_score'],
            'priority_level': result['priority_level'],
            'message': result['message']
        })
    
    return Response({
        'success': True,
        'processed': len(transaction_ids),
        'recovered': sum(1 for r in results if r['recovered']),
        'results': results
    })

@api_view(['GET'])
def get_audit_logs(request):
    """Get audit trail"""
    logs = AuditLog.objects.all().order_by('-created_at')
    serializer = AuditLogSerializer(logs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def analyze_transaction(request, id):
    """
    AI analysis for a single transaction
    """
    tx = get_object_or_404(Transaction, id=id)
    analysis = agent.analyze_transaction(tx)
    return Response(analysis)