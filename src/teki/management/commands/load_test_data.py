from django.core.management.base import BaseCommand
from main.models import Achievement
import random
from datetime import timedelta, date
from main.models import BattlePage, BattleTaskInstance, Task
from wagtail.models import Page
from django.contrib.auth import get_user_model
from main.models import UserProfile, Task

class Command(BaseCommand):
    help = 'Load test data into the database'

    def handle(self, *args, **options):
        self.load_achievements()

    def load_achievements(self):
        achievement_data = [
            {
                "title": "Task Streaker",
                "description": "Complete daily tasks for consecutive days",
                "point_threshold": 10,
                "icon": "flame"  # Matches Lucide icon
            },
            {
                "title": "Fighter’s Ally",
                "description": "Support the fighter by completing tasks regularly",
                "point_threshold": 20,
                "icon": "handshake"
            },
            {
                "title": "Champion of Consistency",
                "description": "Log in and interact with the app regularly",
                "point_threshold": 15,
                "icon": "repeat"
            },
            {
                "title": "Motivation Multiplier",
                "description": "Encourage or interact with other supporters",
                "point_threshold": 5,
                "icon": "message-circle-heart"
            },
            {
                "title": "Battle Master",
                "description": "Help complete high-impact ('Battle') tasks",
                "point_threshold": 30,
                "icon": "sword"
            },
        ]

        created = 0
        for data in achievement_data:
            obj, was_created = Achievement.objects.get_or_create(
                title=data["title"],
                defaults={
                    "description": data["description"],
                    "point_threshold": data["point_threshold"],
                    "icon": data["icon"],
                }
            )
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f"{created} achievements created."))


    def load_tasks(self):
        task_data = [
            # --- Physical Rehab Tasks ---
            {
                "title": "לעמוד זקוף",
                "description": "עמידה זקופה למשך מספר דקות, תרגול יציבה",
                "point_value": 2,
                "difficulty": "easy",
                "repeat_daily": True,
                "est_time": 5,
            },
            {
                "title": "הליכון במסדרון",
                "description": "הליכה במסדרון באמצעות ההליכון",
                "point_value": 3,
                "difficulty": "medium",
                "repeat_daily": True,
                "est_time": 10,
            },
            {
                "title": "לקום מהמיטה",
                "description": "קימה עצמאית מהמיטה עם או בלי עזרה",
                "point_value": 2,
                "difficulty": "medium",
                "repeat_daily": True,
                "est_time": 5,
            },
            {
                "title": "לקחת תרופות",
                "description": "לקיחת תרופות בזמן",
                "point_value": 1,
                "difficulty": "easy",
                "repeat_daily": True,
                "est_time": 2,
            },
            {
                "title": "תרגילי ידיים",
                "description": "תרגול תנועות וחיזוק ידיים",
                "point_value": 3,
                "difficulty": "medium",
                "repeat_daily": True,
                "est_time": 10,
            },
            {
                "title": "תרגילי צוואר",
                "description": "סיבובי ראש, מתיחות צוואר, ותרגול תנועתיות",
                "point_value": 3,
                "difficulty": "medium",
                "repeat_daily": True,
                "est_time": 8,
            },

            # --- Emotional + Mental Support Tasks ---
            {
                "title": "נשימות עמוקות",
                "description": "נשימות עמוקות להרפיה והרגעת מתח",
                "point_value": 1,
                "difficulty": "easy",
                "repeat_daily": True,
                "est_time": 5,
            },
            {
                "title": "לשתות מים",
                "description": "שתיית כוס מים מלאה, לפחות 3 פעמים ביום",
                "point_value": 1,
                "difficulty": "easy",
                "repeat_daily": True,
                "est_time": 2,
            },
            {
                "title": "לצפות בסרטון מרגיע",
                "description": "צפייה בקטע וידאו מעודד או מרגיע",
                "point_value": 2,
                "difficulty": "easy",
                "repeat_daily": True,
                "est_time": 10,
            },
            {
                "title": "שיחת טלפון עם משפחה",
                "description": "שיחה עם קרוב או חברה להפגת בדידות",
                "point_value": 3,
                "difficulty": "medium",
                "repeat_daily": True,
                "est_time": 15,
            },
            {
                "title": "לכתוב ביומן או פתקים",
                "description": "כתיבה קצרה של מחשבות, רגשות או תודה",
                "point_value": 2,
                "difficulty": "easy",
                "repeat_daily": True,
                "est_time": 5,
            },
            {
                "title": "משחק/תשבץ/משהו למוח",
                "description": "פעילות קוגניטיבית כמו תשבץ, משחק קלפים או דף צביעה",
                "point_value": 3,
                "difficulty": "medium",
                "repeat_daily": True,
                "est_time": 15,
            },
            {
                "title": "פתיחת חלון ואור שמש",
                "description": "חשיפה לאור יום טבעי לשיפור מצב הרוח",
                "point_value": 2,
                "difficulty": "easy",
                "repeat_daily": True,
                "est_time": 5,
            },
            {
                "title": "לתכנן משהו נחמד למחר",
                "description": "תכנון פעילות נעימה למחר, אפילו קטנה",
                "point_value": 2,
                "difficulty": "easy",
                "repeat_daily": True,
                "est_time": 5,
            },
        ]

        created = 0
        for data in task_data:
            obj, was_created = Task.objects.get_or_create(
                title=data["title"],
                defaults={
                    "description": data["description"],
                    "point_value": data["point_value"],
                    "difficulty": data["difficulty"],
                    "repeat_daily": data["repeat_daily"],
                    "est_time": data["est_time"],
                }
            )
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f"{created} tasks created."))

    def load_battle_pages(self):
        try:
            parent = Page.objects.get(slug="home-page")
        except Page.DoesNotExist:
            self.stdout.write(self.style.ERROR("Parent page with slug='home-page' not found. Cannot create BattlePages."))
            return

        # Hebrew day name fallback (manual map, not relying on system locale)
        day_names_he = {
            "Monday": "יום שני",
            "Tuesday": "יום שלישי",
            "Wednesday": "יום רביעי",
            "Thursday": "יום חמישי",
            "Friday": "יום שישי",
            "Saturday": "יום שבת",
            "Sunday": "יום ראשון"
        }

        month_names_he = {
            1: "ינואר", 2: "פברואר", 3: "מרץ", 4: "אפריל", 5: "מאי", 6: "יוני",
            7: "יולי", 8: "אוגוסט", 9: "ספטמבר", 10: "אוקטובר", 11: "נובמבר", 12: "דצמבר"
        }

        all_tasks = list(Task.objects.all())

        if len(all_tasks) < 8:
            self.stdout.write(self.style.WARNING("Not enough tasks to create battles. Skipping battle page creation."))
            return

        today = date.today()
        created_pages = 0

        for i in range(10):
            battle_date = today + timedelta(days=i)
            weekday_en = battle_date.strftime('%A')
            day = battle_date.day
            month = month_names_he[battle_date.month]
            year = battle_date.year
            title_he = f"{day_names_he[weekday_en]}, {day} ב{month} {year}"

            # Base slug format
            base_slug = f"battle-{battle_date.isoformat()}"
            
            # Check if a page with this slug already exists
            # If it does, add a timestamp to make it unique
            slug = base_slug
            counter = 1
            
            while Page.objects.filter(slug=slug, path__startswith=parent.path).exists():
                # Page with this slug already exists, add a counter to make it unique
                import time
                timestamp = int(time.time())
                slug = f"{base_slug}-{timestamp}-{counter}"
                counter += 1
                
            description = f"משימות יומיות ליום {title_he}"

            # Only create the page if we don't already have a battle page for this date
            # First check if we already have a page with a similar slug (excluding the timestamp)
            existing_battle = BattlePage.objects.filter(
                slug__startswith=base_slug,
                path__startswith=parent.path
            ).first()
            
            if existing_battle:
                self.stdout.write(self.style.WARNING(f"Battle page for {battle_date.isoformat()} already exists. Skipping."))
                continue
                
            battle_page = BattlePage(
                title=title_he,
                slug=slug,
                description=description,
                point_value=20,
                recommended_frequency=1,
                path_type=random.choice(['straight', 'bumpy', 'zigzag', 'curvy']),
                bg_color="#ffffff",
                bg_color2="#f0f0f0",
            )

            parent.add_child(instance=battle_page)
            battle_page.save_revision().publish()

            selected_tasks = random.sample(all_tasks, 8)

            for task in selected_tasks:
                BattleTaskInstance.objects.create(
                    battle_page=battle_page,
                    task=task,
                    status='available',
                    scheduled_date=battle_date,
                    repeat_at_hour=random.choice([8, 10, 14, 16, 18])
                )

            created_pages += 1

        self.stdout.write(self.style.SUCCESS(f"{created_pages} battle pages created under 'home-page'."))

    def load_users_and_assign_tasks(self):
        User = get_user_model()

        user_data = [
            {"first_name": "Asaf", "last_name": "Fridman", "username": "asafi", "role": "toolholder"},
            {"first_name": "Nathan", "last_name": "Fridman", "username": "saba", "role": "toolholder"},
            {"first_name": "Karin", "last_name": "Holzberg", "username": "karin", "role": "toolholder"},
            {"first_name": "Inbar", "last_name": "Fridman", "username": "bari", "role": "toolholder"},
            {"first_name": "Aliza", "last_name": "Fridman", "username": "savima", "role": "fighter"},
        ]

        created_users = 0

        for data in user_data:
            email = f"{data['username']}@example.com"
            password = f"{data['username'][:4]}1234"

            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    "first_name": data["first_name"],
                    "last_name": data["last_name"],
                    "email": email,
                }
            )

            if created:
                user.set_password(password)
                user.save()
                created_users += 1

            # Create or update profile
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.role = data["role"]
            profile.save()

            # Assign 2 available BattleTaskInstances
            available_instances = list(
                BattleTaskInstance.objects.filter(status='available', user__isnull=True)
            )

            if len(available_instances) < 2:
                self.stdout.write(self.style.WARNING(f"Not enough BattleTaskInstances to assign to {user.username}."))
                continue

            selected_instances = random.sample(available_instances, 2)
            for instance in selected_instances:
                instance.assign_user(user)

        self.stdout.write(self.style.SUCCESS(f"{created_users} users created and assigned 2 battle tasks each."))


    def handle(self, *args, **options):
        self.load_achievements()
        self.load_tasks()
        self.load_battle_pages()
        self.load_users_and_assign_tasks()
