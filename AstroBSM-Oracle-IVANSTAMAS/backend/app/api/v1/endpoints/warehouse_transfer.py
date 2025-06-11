from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.inventory import Inventory
from app.db.models.user_access import UserWarehouseAccess
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/transfer")
def transfer_product(
    product_id: int,
    quantity: int,
    source_warehouse_id: int,
    dest_warehouse_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Access control
    src_access = db.query(UserWarehouseAccess).filter_by(user_id=current_user.id, warehouse_id=source_warehouse_id).first()
    dst_access = db.query(UserWarehouseAccess).filter_by(user_id=current_user.id, warehouse_id=dest_warehouse_id).first()
    if not src_access or not dst_access:
        raise HTTPException(status_code=403, detail="You do not have access to both warehouses.")
    # Deduct from source
    src_inv = db.query(Inventory).filter_by(product_id=product_id, warehouse_id=source_warehouse_id).first()
    if not src_inv or src_inv.quantity < quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock in source warehouse.")
    src_inv.quantity -= quantity
    db.add(src_inv)
    # Add to destination
    dst_inv = db.query(Inventory).filter_by(product_id=product_id, warehouse_id=dest_warehouse_id).first()
    if dst_inv:
        dst_inv.quantity += quantity
    else:
        from app.db.models.inventory import Inventory
        dst_inv = Inventory(product_id=product_id, warehouse_id=dest_warehouse_id, quantity=quantity)
        db.add(dst_inv)
    db.commit()
    # Optionally, log the transfer in a new table
    return {"detail": "Transfer successful"}
