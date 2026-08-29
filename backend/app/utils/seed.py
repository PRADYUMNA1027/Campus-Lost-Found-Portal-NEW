from sqlalchemy.orm import Session
from app.models.user import User
from app.models.item import Item
from app.models.claim import Claim
from app.models.notification import Notification
from app.utils.security import get_password_hash

def seed_database(db: Session):
    # Check if database is already populated
    if db.query(User).first() is not None:
        return

    print("Seeding database with realistic campus data...")

    # 1. Create Default Users
    admin = User(
        name="Campus Security Admin",
        email="admin@campus.edu",
        password_hash=get_password_hash("admin123"),
        role="admin"
    )
    student = User(
        name="Alex Johnson",
        email="student@campus.edu",
        password_hash=get_password_hash("student123"),
        role="student"
    )
    student2 = User(
        name="Sarah Parker",
        email="sarah.p@campus.edu",
        password_hash=get_password_hash("student123"),
        role="student"
    )

    db.add_all([admin, student, student2])
    db.commit()
    db.refresh(admin)
    db.refresh(student)
    db.refresh(student2)

    # 2. Create Items
    items = [
        Item(
            item_name="Black Lenovo Laptop",
            description="Black Lenovo ThinkPad with a blue campus tech club sticker on the top cover. Contains vital course notes.",
            category="Electronics",
            status="Lost",
            image_url="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
            location="Central Library",
            date="2026-08-25",
            time="14:30",
            reward="$50 Reward",
            reporter_id=student.id,
            owner_id=student.id
        ),
        Item(
            item_name="Blue Stainless Steel Water Bottle",
            description="Hydro Flask style 32oz water bottle, royal blue with minor scratches near the bottom rim.",
            category="Accessories",
            status="Lost",
            image_url="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
            location="Campus Gym",
            date="2026-08-24",
            time="17:15",
            reporter_id=student.id,
            owner_id=student.id
        ),
        Item(
            item_name="Student ID Card",
            description="Campus Student Identification Card for Computer Science Senior Class. Name on card starts with S.",
            category="Documents",
            status="Lost",
            image_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            location="Student Center",
            date="2026-08-26",
            time="09:10",
            reward="$10",
            reporter_id=student2.id,
            owner_id=student2.id
        ),
        Item(
            item_name="iPhone 14 Pro - Space Black",
            description="Found an iPhone with clear silicone case on table 4 of Engineering Quad.",
            category="Electronics",
            status="Found",
            image_url="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
            location="Engineering Block",
            date="2026-08-26",
            time="13:00",
            storage_location="Campus Lost & Found Office - Locker #12",
            verification_question="What lockscreen wallpaper or customized case sticker is on the phone?",
            reporter_id=admin.id
        ),
        Item(
            item_name="Brown Leather Wallet",
            description="Genuine brown leather bi-fold wallet found under bench near parking lot B.",
            category="Accessories",
            status="Found",
            image_url="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
            location="West Parking Lot",
            date="2026-08-25",
            time="16:20",
            storage_location="Library Security Desk",
            verification_question="What initials or cards are inside the billfold?",
            reporter_id=student.id
        )
    ]

    db.add_all(items)
    db.commit()

    # 3. Create Sample Claim
    claim = Claim(
        item_id=items[3].id,
        claimer_id=student.id,
        reason="I dropped my iPhone while sitting at table 4 after my 12:30 Physics lecture.",
        ownership_details="It has a small scratch on the camera module bezel and a wallpaper of a galaxy nebula.",
        verification_answer="The lockscreen wallpaper is a purple galaxy nebula photo.",
        status="Pending"
    )
    db.add(claim)

    # 4. Create Sample Notifications
    notifications = [
        Notification(
            user_id=student.id,
            type="Claim Submitted",
            message="Your claim for 'iPhone 14 Pro - Space Black' was successfully submitted. Admin is reviewing your answer.",
            read_status=False
        ),
        Notification(
            user_id=student.id,
            type="New Matching Item",
            message="A new found item 'Black Lenovo Laptop' matching your report criteria was just posted in Central Library.",
            read_status=True
        )
    ]
    db.add_all(notifications)
    db.commit()

    print("Database seeding completed successfully.")
