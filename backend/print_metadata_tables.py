from app.db.base import Base
from app.db.models import user, inventory, payroll, customer, supplier, customer_performance, staff, settings, warehouse, product_stock_intake, raw_material, production_requirement, product, production_output, production_console_output, factory_inventory, export_tracking, invoice

print("Tables in Base.metadata:", list(Base.metadata.tables.keys()))
