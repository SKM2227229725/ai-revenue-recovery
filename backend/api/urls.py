from django.urls import path, include

urlpatterns = [
    # Recovery APIs
    path('recovery/', include('recovery.urls')),
]