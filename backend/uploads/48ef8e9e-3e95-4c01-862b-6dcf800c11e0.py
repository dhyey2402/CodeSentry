"""
Seed data script to populate the educational management system with sample data.
This script creates dummy data for:
- Users (admins, teachers, students)
- Classes
- Subjects
- Timetable entries
- Assignments
- Notifications
- Attendance records
"""

from flask import Flask
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random
from faker import Faker

from models import db, User, Admin, Teacher, Student, Class, Subject
from models import TeacherSubject, Timetable, Assignment, Attendance, Notification
from config import Config

fake = Faker()

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

def create_admin_users(count=2):
    """Create admin users"""
    print(f"Creating {count} admin users...")
    
    # Make sure we have at least the default admin
    if not User.query.filter_by(email='admin@example.com').first():
        admin_user = User(
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            role='admin'
        )
        admin_user.set_password('admin123')
        db.session.add(admin_user)
        db.session.flush()  # Flush to get the user ID
        
        admin = Admin(
            user_id=admin_user.id,
            department='Administration'
        )
        db.session.add(admin)
        count -= 1
    
    # Create additional admins
    for i in range(count):
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"admin{i+1}@example.com"
        
        admin_user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role='admin'
        )
        admin_user.set_password('password123')
        db.session.add(admin_user)
        db.session.flush()  # Flush to get the user ID
        
        admin = Admin(
            user_id=admin_user.id,
            department=random.choice(['IT', 'Management', 'Finance', 'HR'])
        )
        db.session.add(admin)
    
    db.session.commit()
    print("Admin users created successfully!")

def create_subjects(count=10):
    """Create subjects"""
    print(f"Creating {count} subjects...")
    
    subjects = [
        {"name": "Mathematics", "code": "MATH101", "description": "Basic mathematics including algebra, calculus and geometry"},
        {"name": "Physics", "code": "PHYS101", "description": "Introduction to physics concepts and theories"},
        {"name": "Chemistry", "code": "CHEM101", "description": "Basic concepts in chemistry and laboratory skills"},
        {"name": "Biology", "code": "BIOL101", "description": "Study of living organisms and biological systems"},
        {"name": "Computer Science", "code": "CS101", "description": "Introduction to programming and computer science principles"},
        {"name": "English Literature", "code": "ENG101", "description": "Analysis of literature and development of writing skills"},
        {"name": "History", "code": "HIST101", "description": "Study of significant events and developments in human history"},
        {"name": "Geography", "code": "GEO101", "description": "Study of physical features of the earth and human interactions"},
        {"name": "Economics", "code": "ECON101", "description": "Introduction to economic theory and practice"},
        {"name": "Physical Education", "code": "PE101", "description": "Development of physical fitness and sports skills"}
    ]
    
    for i in range(min(count, len(subjects))):
        subject = Subject(
            name=subjects[i]["name"],
            code=subjects[i]["code"],
            description=subjects[i]["description"]
        )
        db.session.add(subject)
    
    # Add more subjects if needed
    for i in range(len(subjects), count):
        subject = Subject(
            name=f"Subject {i+1}",
            code=f"SUB{i+1:03d}",
            description=fake.paragraph()
        )
        db.session.add(subject)
    
    db.session.commit()
    print("Subjects created successfully!")

def create_teachers(count=10):
    """Create teachers"""
    print(f"Creating {count} teachers...")
    
    departments = ["Science", "Mathematics", "Languages", "Humanities", "Arts", "Physical Education"]
    designations = ["Assistant Professor", "Associate Professor", "Professor", "Senior Teacher", "Junior Teacher"]
    
    for i in range(count):
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"teacher{i+1}@example.com"
        
        teacher_user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role='teacher',
            phone=fake.phone_number()
        )
        teacher_user.set_password('password123')
        db.session.add(teacher_user)
        db.session.flush()  # Flush to get the user ID
        
        teacher = Teacher(
            user_id=teacher_user.id,
            department=random.choice(departments),
            designation=random.choice(designations)
        )
        db.session.add(teacher)
    
    db.session.commit()
    print("Teachers created successfully!")

def create_classes(count=5):
    """Create classes"""
    print(f"Creating {count} classes...")
    
    # Get all teacher IDs
    teachers = Teacher.query.all()
    if not teachers:
        print("No teachers found. Please create teachers first.")
        return
    
    class_names = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", 
                 "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]
    current_year = datetime.now().year
    
    for i in range(min(count, len(class_names))):
        class_obj = Class(
            name=class_names[i],
            year=current_year,
            teacher_id=random.choice(teachers).id
        )
        db.session.add(class_obj)
    
    # Add more classes if needed
    for i in range(len(class_names), count):
        class_obj = Class(
            name=f"Class {i+1}",
            year=current_year,
            teacher_id=random.choice(teachers).id
        )
        db.session.add(class_obj)
    
    db.session.commit()
    print("Classes created successfully!")

def create_students(count=50):
    """Create students"""
    print(f"Creating {count} students...")
    
    # Get all class IDs
    classes = Class.query.all()
    if not classes:
        print("No classes found. Please create classes first.")
        return
    
    current_year = datetime.now().year
    admission_years = [current_year, current_year-1, current_year-2]
    
    for i in range(count):
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"student{i+1}@example.com"
        
        student_user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role='student',
            phone=fake.phone_number()
        )
        student_user.set_password('password123')
        db.session.add(student_user)
        db.session.flush()  # Flush to get the user ID
        
        student = Student(
            user_id=student_user.id,
            roll_number=f"R{current_year}{i+1:04d}",
            class_id=random.choice(classes).id,
            year_of_admission=random.choice(admission_years)
        )
        db.session.add(student)
        
        # Commit every 10 students to avoid large transactions
        if (i+1) % 10 == 0:
            db.session.commit()
            print(f"Created {i+1} students...")
    
    db.session.commit()
    print("Students created successfully!")

def assign_teachers_to_subjects():
    """Assign teachers to subjects"""
    print("Assigning teachers to subjects...")
    
    teachers = Teacher.query.all()
    subjects = Subject.query.all()
    current_year = datetime.now().year
    
    if not teachers or not subjects:
        print("No teachers or subjects found. Please create them first.")
        return
    
    # Each teacher gets 1-3 subjects
    for teacher in teachers:
        # Get random number of subjects for this teacher (1-3)
        num_subjects = random.randint(1, min(3, len(subjects)))
        # Get random subjects for this teacher
        teacher_subjects = random.sample(subjects, num_subjects)
        
        for subject in teacher_subjects:
            teacher_subject = TeacherSubject(
                teacher_id=teacher.id,
                subject_id=subject.id,
                year=current_year
            )
            db.session.add(teacher_subject)
    
    db.session.commit()
    print("Teachers assigned to subjects successfully!")

def create_timetable_entries():
    """Create timetable entries for classes"""
    print("Creating timetable entries...")
    
    classes = Class.query.all()
    subjects = Subject.query.all()
    
    if not classes or not subjects:
        print("No classes or subjects found. Please create them first.")
        return
    
    days_of_week = list(range(0, 5))  # Monday to Friday
    
    # More structured time slots with clear periods
    time_slots = [
        {"period": 1, "start": "08:00", "end": "09:00", "name": "First Period"},
        {"period": 2, "start": "09:10", "end": "10:10", "name": "Second Period"},
        {"period": 3, "start": "10:20", "end": "11:20", "name": "Third Period"},
        {"period": 4, "start": "11:30", "end": "12:30", "name": "Fourth Period"},
        {"period": 5, "start": "13:30", "end": "14:30", "name": "Fifth Period"},
        {"period": 6, "start": "14:40", "end": "15:40", "name": "Sixth Period"}
    ]
    
    # More room variety with specialized rooms
    rooms = {
        "regular": ["101", "102", "103", "201", "202", "203", "301", "302", "303"],
        "science": ["LAB-1", "LAB-2", "CHEM-LAB", "PHY-LAB", "BIO-LAB"],
        "computers": ["COMP-1", "COMP-2", "TECH-LAB"],
        "arts": ["ART-STUDIO", "MUSIC-ROOM", "DANCE-HALL"],
        "sports": ["GYM", "FIELD-1", "COURT-1"]
    }
    
    # Map subjects to room types
    subject_room_map = {
        "Mathematics": "regular",
        "Physics": "science",
        "Chemistry": "science",
        "Biology": "science",
        "Computer Science": "computers",
        "English Literature": "regular",
        "History": "regular",
        "Geography": "regular",
        "Economics": "regular",
        "Physical Education": "sports"
    }
    
    # Create teacher availability
    teachers = Teacher.query.all()
    teacher_availability = {}
    for teacher in teachers:
        # Initialize availability for each teacher
        teacher_availability[teacher.id] = {day: list(range(len(time_slots))) for day in days_of_week}
    
    # For each class, create a structured weekly timetable
    for class_obj in classes:
        print(f"Creating timetable for {class_obj.name}...")
        
        # Get teacher-subject mappings for proper assignments
        subject_teachers = {}
        for subject in subjects:
            teacher_subjects = TeacherSubject.query.filter_by(subject_id=subject.id).all()
            if teacher_subjects:
                subject_teachers[subject.id] = [ts.teacher_id for ts in teacher_subjects]
        
        # Assign subjects to class with better distribution
        # Each class gets 6-8 subjects
        class_subjects = random.sample(subjects, min(random.randint(6, 8), len(subjects)))
        
        # Distribute subjects across the week with specific patterns
        for day in days_of_week:
            day_name = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][day]
            print(f"  Creating schedule for {day_name}...")
            
            # Create a daily schedule with logical subject ordering
            daily_schedule = []
            
            # Assign subjects to periods based on typical scheduling practices
            # Core subjects (Math, Science, English) in morning slots
            # Electives and PE in afternoon slots
            core_subjects = [s for s in class_subjects if s.name in ["Mathematics", "Physics", "Chemistry", "Biology", "English Literature"]]
            other_subjects = [s for s in class_subjects if s not in core_subjects]
            
            # Morning periods (usually core subjects)
            morning_slots = time_slots[:4]
            for i, slot in enumerate(morning_slots):
                if i < len(core_subjects) and random.random() < 0.95:  # 95% chance of having a morning class
                    subject = core_subjects[i % len(core_subjects)]
                    daily_schedule.append((slot, subject))
            
            # Afternoon periods (usually electives/PE)
            afternoon_slots = time_slots[4:]
            for i, slot in enumerate(afternoon_slots):
                if i < len(other_subjects) and random.random() < 0.85:  # 85% chance of having an afternoon class
                    subject = other_subjects[i % len(other_subjects)]
                    daily_schedule.append((slot, subject))
            
            # Create actual timetable entries
            for slot, subject in daily_schedule:
                # Assign an appropriate teacher for this subject
                available_teachers = subject_teachers.get(subject.id, [])
                
                if not available_teachers:
                    # If no specific teacher for this subject, get any teacher
                    teacher_id = random.choice(teachers).id if teachers else None
                else:
                    # Get available teachers for this time slot
                    available_teachers = [t_id for t_id in available_teachers 
                                        if slot["period"]-1 in teacher_availability.get(t_id, {}).get(day, [])]
                    
                    if available_teachers:
                        teacher_id = random.choice(available_teachers)
                    else:
                        # If no teacher is available, get any teacher for this subject
                        teacher_id = random.choice(subject_teachers.get(subject.id, []))
                
                # Mark this teacher as not available for this time slot
                if teacher_id and teacher_id in teacher_availability and day in teacher_availability[teacher_id]:
                    if slot["period"]-1 in teacher_availability[teacher_id][day]:
                        teacher_availability[teacher_id][day].remove(slot["period"]-1)
                
                # Select appropriate room based on subject
                room_type = subject_room_map.get(subject.name, "regular")
                room = random.choice(rooms[room_type])
                
                # Create timetable entry
                timetable = Timetable(
                    class_id=class_obj.id,
                    subject_id=subject.id,
                    day_of_week=day,
                    start_time=datetime.strptime(slot["start"], "%H:%M").time(),
                    end_time=datetime.strptime(slot["end"], "%H:%M").time(),
                    room=room
                )
                
                # 5% chance of having a substitute teacher
                if random.random() < 0.05 and teachers:
                    # Get a different teacher as substitute
                    substitute_teachers = [t for t in teachers if t.id != teacher_id]
                    if substitute_teachers:
                        substitute = random.choice(substitute_teachers)
                        timetable.is_substituted = True
                        timetable.substitute_teacher_id = substitute.id
                
                db.session.add(timetable)
    
    db.session.commit()
    print("Timetable entries created successfully!")

def create_assignments(count=40):
    """Create assignments with realistic distribution and types"""
    print(f"Creating {count} assignments...")
    
    teachers = Teacher.query.all()
    subjects = Subject.query.all()
    classes = Class.query.all()
    
    if not teachers or not subjects or not classes:
        print("No teachers, subjects, or classes found. Please create them first.")
        return
    
    current_date = datetime.now()
    
    # Assignment types with specific formats and descriptions
    assignment_types = [
        {"type": "homework", "prefix": "Homework", "desc_template": "Complete exercises {0} through {1} from the textbook chapter {2}."},
        {"type": "project", "prefix": "Project", "desc_template": "Research and present on {0}. Include {1} and analyze {2}."},
        {"type": "essay", "prefix": "Essay", "desc_template": "Write a {0}-page essay on '{1}'. Focus on {2} and include references."},
        {"type": "quiz", "prefix": "Quiz Prep", "desc_template": "Prepare for quiz on {0}. Study chapters {1}-{2} and review class notes."},
        {"type": "presentation", "prefix": "Presentation", "desc_template": "Prepare a {0}-minute presentation about {1}. Cover {2} and be ready for questions."},
        {"type": "lab_report", "prefix": "Lab Report", "desc_template": "Complete lab report for the {0} experiment. Document {1} and analyze {2}."}
    ]
    
    # Specific assignment topics by subject
    subject_topics = {
        "Mathematics": ["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry", "Number Theory", "Set Theory"],
        "Physics": ["Mechanics", "Electricity", "Magnetism", "Thermodynamics", "Optics", "Quantum Physics", "Relativity"],
        "Chemistry": ["Organic Chemistry", "Inorganic Chemistry", "Stoichiometry", "Chemical Bonding", "Acids and Bases", "Redox Reactions"],
        "Biology": ["Cell Biology", "Genetics", "Ecology", "Anatomy", "Evolution", "Taxonomy", "Microbiology"],
        "Computer Science": ["Programming", "Algorithms", "Data Structures", "Web Development", "Databases", "Networking", "Cybersecurity"],
        "English Literature": ["Shakespeare", "Poetry Analysis", "Novel Study", "Creative Writing", "Literary Criticism", "Drama"],
        "History": ["Ancient Civilizations", "World Wars", "Renaissance", "Industrial Revolution", "Cold War", "Civil Rights Movements"],
        "Geography": ["Climate Change", "Natural Resources", "Population Studies", "Economic Geography", "Cultural Geography"],
        "Economics": ["Microeconomics", "Macroeconomics", "International Trade", "Economic Development", "Financial Markets"],
        "Physical Education": ["Sports Rules", "Fitness Planning", "Nutrition", "Training Methods", "Sports Psychology"]
    }
    
    # Generate different assignment patterns
    # - Recently assigned (not due yet)
    # - Due soon (within 3 days)
    # - Past due (already expired)
    # - Long-term projects (due in 3-4 weeks)
    
    created_count = 0
    while created_count < count:
        teacher = random.choice(teachers)
        subject = random.choice(subjects)
        class_obj = random.choice(classes)
        
        # Select assignment type appropriate for the subject
        if subject.name in ["Physics", "Chemistry", "Biology"]:
            assignment_type = random.choice([t for t in assignment_types if t["type"] in ["homework", "lab_report", "quiz", "project"]])
        elif subject.name == "Mathematics":
            assignment_type = random.choice([t for t in assignment_types if t["type"] in ["homework", "quiz"]])
        elif subject.name == "English Literature":
            assignment_type = random.choice([t for t in assignment_types if t["type"] in ["essay", "presentation", "project"]])
        elif subject.name == "Computer Science":
            assignment_type = random.choice([t for t in assignment_types if t["type"] in ["project", "homework", "presentation"]])
        else:
            assignment_type = random.choice(assignment_types)
        
        # Get topics for this subject
        topics = subject_topics.get(subject.name, ["General Topic 1", "General Topic 2", "General Topic 3"])
        topic = random.choice(topics)
        
        # Create title based on type and subject
        title = f"{assignment_type['prefix']}: {topic} - {subject.name}"
        
        # Create detailed description based on template
        if assignment_type["type"] == "homework":
            desc = assignment_type["desc_template"].format(
                random.randint(1, 10),
                random.randint(11, 30),
                random.randint(1, 12)
            )
        elif assignment_type["type"] == "project":
            desc = assignment_type["desc_template"].format(
                topic,
                random.choice(["visual aids", "data analysis", "case studies", "experiments"]),
                random.choice(["current trends", "historical context", "practical applications", "theoretical frameworks"])
            )
        elif assignment_type["type"] == "essay":
            desc = assignment_type["desc_template"].format(
                random.randint(2, 10),
                topic,
                random.choice(["critical analysis", "comparative perspectives", "historical significance", "modern applications"])
            )
        elif assignment_type["type"] == "quiz":
            desc = assignment_type["desc_template"].format(
                topic,
                random.randint(1, 5),
                random.randint(6, 10)
            )
        elif assignment_type["type"] == "presentation":
            desc = assignment_type["desc_template"].format(
                random.randint(5, 15),
                topic,
                random.choice(["historical context", "current applications", "future implications", "critical debates"])
            )
        elif assignment_type["type"] == "lab_report":
            desc = assignment_type["desc_template"].format(
                topic,
                random.choice(["methods", "observations", "equipment setup", "safety procedures"]),
                random.choice(["results", "error sources", "theoretical implications", "practical applications"])
            )
        else:
            desc = fake.paragraph()
        
        # Determine assignment timing pattern
        pattern = random.choice(["recent", "due_soon", "past_due", "long_term"])
        
        if pattern == "recent":
            # Recently assigned (1-5 days ago, due in 1-2 weeks)
            days_ago = random.randint(1, 5)
            assigned_date = current_date - timedelta(days=days_ago)
            due_date = assigned_date + timedelta(days=random.randint(7, 14))
        elif pattern == "due_soon":
            # Due soon (assigned 1-2 weeks ago, due in 1-3 days)
            days_ago = random.randint(7, 14)
            assigned_date = current_date - timedelta(days=days_ago)
            due_date = current_date + timedelta(days=random.randint(1, 3))
        elif pattern == "past_due":
            # Past due (assigned 2-4 weeks ago, due 1-5 days ago)
            days_ago = random.randint(14, 28)
            assigned_date = current_date - timedelta(days=days_ago)
            due_date = current_date - timedelta(days=random.randint(1, 5))
        else:  # long_term
            # Long-term project (assigned recently, due in 3-4 weeks)
            days_ago = random.randint(1, 7)
            assigned_date = current_date - timedelta(days=days_ago)
            due_date = current_date + timedelta(days=random.randint(21, 28))
        
        # Create the assignment
        assignment = Assignment(
            title=title,
            description=desc,
            subject_id=subject.id,
            teacher_id=teacher.id,
            class_id=class_obj.id,
            assigned_date=assigned_date,
            due_date=due_date,
            file_path=f"assignments/{subject.code.lower()}_{created_count+1}.pdf" if random.random() < 0.3 else None
        )
        db.session.add(assignment)
        
        created_count += 1
        
        # Commit in batches to avoid large transactions
        if created_count % 10 == 0:
            db.session.commit()
            print(f"  Created {created_count} assignments so far...")
    
    db.session.commit()
    print("Assignments created successfully!")

def create_attendance_records():
    """Create attendance records for students"""
    print("Creating attendance records...")
    
    # Get all students and subjects
    students = Student.query.all()
    subjects = Subject.query.all()
    teachers = Teacher.query.all()
    classes = Class.query.all()
    
    if not students or not subjects or not teachers or not classes:
        print("Cannot create attendance records: missing students, subjects, teachers, or classes")
        return
    
    current_date = datetime.now().date()
    
    # Create attendance for the past 60 days to have more historical data
    for day_offset in range(60, 0, -1):
        attendance_date = current_date - timedelta(days=day_offset)
        
        # Skip weekends
        if attendance_date.weekday() >= 5:  # 5 = Saturday, 6 = Sunday
            continue
            
        print(f"Creating attendance records for {attendance_date}...")
        
        # For each class
        for class_obj in classes:
            # Get students in this class
            class_students = Student.query.filter_by(class_id=class_obj.id).all()
            
            if not class_students:
                continue
                
            # Create attendance for 3-4 subjects per day
            daily_subjects = random.sample(subjects, min(random.randint(3, 4), len(subjects)))
            
            for subject in daily_subjects:
                # Find a teacher for this subject
                teacher_subject = TeacherSubject.query.filter_by(subject_id=subject.id).first()
                
                if not teacher_subject:
                    continue
                    
                teacher = Teacher.query.get(teacher_subject.teacher_id)
                
                if not teacher:
                    continue
                
                # For each student in this class
                for student in class_students:
                    # Create realistic attendance patterns
                    # Regular students (80% present)
                    # Frequent absentees (60% present)
                    # Perfect attendance (98% present)
                    
                    # Assign attendance patterns to students based on their ID
                    if student.id % 10 == 0:  # 10% students with perfect attendance
                        attendance_probability = 0.98
                    elif student.id % 5 == 0:  # 20% students with poor attendance
                        attendance_probability = 0.6
                    else:  # 70% students with regular attendance
                        attendance_probability = 0.85
                    
                    # Apply some pattern to specific days (e.g., Mondays have more absences)
                    if attendance_date.weekday() == 0:  # Monday
                        attendance_probability -= 0.1
                    
                    status = 'present' if random.random() < attendance_probability else 'absent'
                    
                    attendance = Attendance(
                        student_id=student.id,
                        subject_id=subject.id,
                        date=attendance_date,
                        status=status,
                        marked_by_id=teacher.id
                    )
                    db.session.add(attendance)
            
            # Commit after each class to avoid large transactions
            db.session.commit()
    
    print("Attendance records created successfully!")

def create_notifications(count=50):
    """Create notifications with meaningful content and patterns"""
    print(f"Creating {count} notifications...")
    
    users = User.query.all()
    admins = User.query.filter_by(role='admin').all()
    teachers = User.query.filter_by(role='teacher').all()
    students = User.query.filter_by(role='student').all()
    classes = Class.query.all()
    subjects = Subject.query.all()
    
    if not users or not classes:
        print("No users or classes found. Please create them first.")
        return
    
    notification_types = ['announcement', 'assignment', 'attendance', 'appointment', 'event', 'reminder']
    
    # Detailed notification templates by type
    notification_templates = {
        'announcement': [
            {"title": "School Assembly", "template": "School assembly will be held on {0} at {1}. All students must attend. Topic: {2}."},
            {"title": "Holiday Announcement", "template": "School will be closed from {0} to {1} for {2} holidays."},
            {"title": "Curriculum Update", "template": "The {0} curriculum has been updated. New topics include {1} and {2}."},
            {"title": "Infrastructure Update", "template": "The {0} facility will be {1} from {2} until further notice."}
        ],
        'assignment': [
            {"title": "New Assignment Posted", "template": "A new {0} assignment has been posted for {1}. Due date: {2}."},
            {"title": "Assignment Deadline Extension", "template": "The deadline for the {0} assignment has been extended to {1}."},
            {"title": "Assignment Feedback Available", "template": "Feedback for your {0} assignment is now available. Grade: {1}/100."}
        ],
        'attendance': [
            {"title": "Attendance Warning", "template": "Your attendance in {0} is currently at {1}%. Minimum required: 75%."},
            {"title": "Attendance Update", "template": "Your attendance has been marked for {0} classes from {1} to {2}."},
            {"title": "Absence Notification", "template": "You were marked absent for {0} on {1}. Please provide a valid reason."}
        ],
        'appointment': [
            {"title": "Appointment Request", "template": "You have a new appointment request from {0} for {1} at {2}."},
            {"title": "Appointment Confirmation", "template": "Your appointment with {0} on {1} at {2} has been confirmed."},
            {"title": "Appointment Rescheduled", "template": "Your appointment with {0} has been rescheduled to {1} at {2}."}
        ],
        'event': [
            {"title": "Sports Day Announcement", "template": "Annual Sports Day will be held on {0}. Events include {1} and {2}."},
            {"title": "Cultural Fest", "template": "The school's Cultural Fest will take place on {0}. Theme: {1}."},
            {"title": "Parent-Teacher Meeting", "template": "PTM scheduled for {0} from {1} to {2}. Please be punctual."},
            {"title": "Career Counseling Session", "template": "Career counseling session by {0} on {1} at {2}. Open to all students."}
        ],
        'reminder': [
            {"title": "Fee Payment Reminder", "template": "This is a reminder to pay the {0} fees by {1}. Amount: {2}."},
            {"title": "Document Submission", "template": "Please submit your {0} documents by {1} to the {2} office."},
            {"title": "Exam Schedule Reminder", "template": "{0} exams begin on {1}. Ensure you have your {2} ready."}
        ]
    }
    
    current_date = datetime.now()
    
    # Generate different notification patterns
    created_count = 0
    while created_count < count:
        # Select notification type
        notification_type = random.choice(notification_types)
        
        # Select appropriate template
        template_data = random.choice(notification_templates[notification_type])
        title = template_data["title"]
        message_template = template_data["template"]
        
        # Determine sender and recipient based on notification type
        if notification_type in ['announcement', 'event']:
            # From admin to everyone or specific classes
            if admins:
                sender = random.choice(admins)
                # Either to a specific student or to multiple students
                if random.random() < 0.7 and students:  # 70% to specific student
                    recipient = random.choice(students)
                    recipient_type = "individual"
                else:  # 30% broadcast
                    recipient = random.choice(admins)  # Placeholder, will be broadcast
                    recipient_type = "broadcast"
            else:
                sender = random.choice(users)
                recipient = random.choice(users)
                recipient_type = "individual"
                
        elif notification_type in ['assignment', 'attendance']:
            # From teacher to students
            if teachers and students:
                sender = random.choice(teachers)
                recipient = random.choice(students)
                recipient_type = "individual"
            else:
                sender = random.choice(users)
                recipient = random.choice(users)
                recipient_type = "individual"
                
        elif notification_type == 'appointment':
            # Between teachers and students
            if teachers and students:
                if random.random() < 0.5:  # 50% teacher to student
                    sender = random.choice(teachers)
                    recipient = random.choice(students)
                else:  # 50% student to teacher
                    sender = random.choice(students)
                    recipient = random.choice(teachers)
                recipient_type = "individual"
            else:
                sender = random.choice(users)
                recipient = random.choice(users)
                recipient_type = "individual"
                
        elif notification_type == 'reminder':
            # Various senders and recipients
            sender = random.choice(users)
            recipient = random.choice(users)
            recipient_type = "individual"
            # Ensure sender and recipient are different
            while recipient.id == sender.id:
                recipient = random.choice(users)
        else:
            sender = random.choice(users)
            recipient = random.choice(users)
            recipient_type = "individual"
        
        # Format message based on template and notification type
        if notification_type == 'announcement':
            future_date = current_date + timedelta(days=random.randint(1, 14))
            future_date_str = future_date.strftime("%B %d, %Y")
            time_str = f"{random.randint(8, 17):02d}:{random.choice(['00', '15', '30', '45'])}"
            topics = ["Environmental Awareness", "Career Guidance", "Health and Wellness", "Academic Excellence", "Community Service"]
            message = message_template.format(future_date_str, time_str, random.choice(topics))
            
        elif notification_type == 'assignment':
            if subjects:
                subject = random.choice(subjects)
                subject_name = subject.name
            else:
                subject_name = "General Studies"
                
            assignment_type = random.choice(["weekly", "project", "homework", "research", "presentation"])
            future_date = current_date + timedelta(days=random.randint(3, 14))
            future_date_str = future_date.strftime("%B %d, %Y")
            
            message = message_template.format(assignment_type, subject_name, future_date_str)
            
        elif notification_type == 'attendance':
            if subjects:
                subject = random.choice(subjects)
                subject_name = subject.name
            else:
                subject_name = "General Studies"
                
            attendance_percent = f"{random.randint(60, 99)}"
            start_date = (current_date - timedelta(days=random.randint(10, 20))).strftime("%B %d")
            end_date = (current_date - timedelta(days=random.randint(1, 5))).strftime("%B %d")
            
            message = message_template.format(subject_name, attendance_percent, f"{start_date} to {end_date}")
            
        elif notification_type == 'appointment':
            person_name = f"{fake.first_name()} {fake.last_name()}"
            future_date = (current_date + timedelta(days=random.randint(1, 10))).strftime("%B %d, %Y")
            time_str = f"{random.randint(9, 16):02d}:{random.choice(['00', '15', '30', '45'])}"
            
            message = message_template.format(person_name, future_date, time_str)
            
        elif notification_type == 'event':
            future_date = (current_date + timedelta(days=random.randint(7, 30))).strftime("%B %d, %Y")
            activities = ["Sports Competition", "Science Exhibition", "Art Workshop", "Debate Competition", "Music Recital", "Dance Performance"]
            theme = random.choice(["Innovation", "Sustainability", "Cultural Heritage", "Future Technologies", "Global Citizenship"])
            time_range = f"{random.randint(9, 12):02d}:00 to {random.randint(13, 17):02d}:00"
            
            message = message_template.format(future_date, random.choice(activities), random.choice(activities))
            
        elif notification_type == 'reminder':
            fee_types = ["Tuition", "Examination", "Laboratory", "Library", "Sports", "Transportation"]
            doc_types = ["Identity", "Medical", "Academic", "Residency", "Scholarship"]
            offices = ["Administrative", "Academic", "Admission", "Accounts", "Principal's"]
            future_date = (current_date + timedelta(days=random.randint(3, 14))).strftime("%B %d, %Y")
            amount = f"${random.randint(50, 500)}"
            
            message = message_template.format(random.choice(fee_types), future_date, amount)
            
        else:
            message = fake.paragraph()
        
        # Determine timing pattern
        timing_pattern = random.choice(["recent", "old", "very_old"])
        
        if timing_pattern == "recent":
            # Recent notification (0-7 days ago)
            days_ago = random.randint(0, 7)
        elif timing_pattern == "old":
            # Older notification (8-21 days ago)
            days_ago = random.randint(8, 21)
        else:
            # Very old notification (22-60 days ago)
            days_ago = random.randint(22, 60)
            
        created_at = current_date - timedelta(days=days_ago)
        
        # Determine read status based on age (older messages more likely to be read)
        if days_ago < 3:
            read_probability = 0.3  # 30% read if very recent
        elif days_ago < 14:
            read_probability = 0.7  # 70% read if moderately old
        else:
            read_probability = 0.9  # 90% read if very old
            
        read = random.random() < read_probability
        
        # Create the notification
        notification = Notification(
            sender_id=sender.id,
            recipient_id=recipient.id,
            title=title,
            message=message,
            created_at=created_at,
            read=read,
            notification_type=notification_type,
            related_id=random.randint(1, 100) if random.random() < 0.5 else None  # 50% chance of having related entity
        )
        db.session.add(notification)
        
        created_count += 1
        
        # Commit in batches to avoid large transactions
        if created_count % 10 == 0:
            db.session.commit()
            print(f"  Created {created_count} notifications so far...")
    
    db.session.commit()
    print("Notifications created successfully!")

def seed_database():
    """Main function to seed the database with sample data"""
    with app.app_context():
        print("Starting database seeding...")
        
        # Check if tables exist
        try:
            # Check if data already exists
            user_count = User.query.count()
            if user_count > 0:
                print(f"Database already has {user_count} users.")
                print("Proceeding to add more sample data...")
            
            # Create sample data
            create_admin_users()
            create_subjects()
            create_teachers()
            create_classes()
            create_students()
            assign_teachers_to_subjects()
            create_timetable_entries()
            create_assignments()
            create_attendance_records()
            create_notifications()
            
            print("Database seeding completed successfully!")
            
        except Exception as e:
            print(f"Error seeding database: {e}")
            db.session.rollback()

if __name__ == "__main__":
    seed_database()