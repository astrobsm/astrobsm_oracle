from fastapi import APIRouter

api_router = APIRouter()

# Import and include endpoint routers
from .endpoints.payroll import router as payroll_router
from .endpoints.inventory import router as inventory_router
from .endpoints import suppliers, staff, settings, customers, warehouses, products, registration, invoices, customer_performance, product_stock_intake, raw_material_stock_intake, production_requirements
from .endpoints import reports
from .endpoints.devices import router as devices_router
from .endpoints.device_maintenance import router as device_maintenance_router
from .endpoints import auth
# Add other endpoint imports as needed

api_router.include_router(payroll_router, tags=["payroll"])
api_router.include_router(inventory_router, prefix="/inventory", tags=["inventory"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["Suppliers"])
api_router.include_router(staff.router, prefix="/staff", tags=["Staff"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(warehouses.router, prefix="/warehouses", tags=["Warehouses"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(registration.router, prefix="/registration", tags=["Registration"])
api_router.include_router(invoices.router, prefix="/invoices", tags=["Invoices"])
api_router.include_router(customer_performance.router, prefix="/customer-performance", tags=["Customer Performance"])
api_router.include_router(customer_performance.router, prefix="/customers-performance", tags=["Customer Performance Alias"])
api_router.include_router(product_stock_intake.router, prefix="/product-stock-intake", tags=["Product Stock Intake"])
api_router.include_router(raw_material_stock_intake.router, prefix="/raw-material-stock-intake", tags=["Raw Material Stock Intake"])
api_router.include_router(raw_material_stock_intake.router, tags=["Raw Material Stock Level"])
api_router.include_router(production_requirements.router, prefix="/production-requirements", tags=["Production Requirements"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(reports.router, tags=["Reports"])
api_router.include_router(devices_router, prefix="/devices", tags=["Devices"])
api_router.include_router(device_maintenance_router, prefix="/device-maintenance", tags=["Device Maintenance"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# Include other routers as needed