from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="BNPL API",
        default_version="v1",
        description="API docs for BNPL dashboard",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # OpenAPI schema JSON/YAML
    re_path(r"^swagger(?P<format>\.json|\.yaml)$",
            schema_view.without_ui(cache_timeout=0),
            name="schema-json"),

    # Swagger UI
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0),
         name="schema-swagger-ui"),

    # ReDoc UI
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0),
         name="schema-redoc"),

    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(),
         name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(),
         name="token_refresh"),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/plans/", include("apps.plans.urls")),
    path("api/analytics/", include("apps.analytics.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
