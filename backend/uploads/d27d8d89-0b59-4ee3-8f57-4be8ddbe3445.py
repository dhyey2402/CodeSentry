import sys
import os

# Add the project root to sys.path
# Assuming the script is in a 'scripts' subdirectory
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

from app import db, app
from models import User, Admin, Teacher, Student, Class, Subject, Timetable, Attendance, Assignment, Appointment, Notification, AssignmentSubmission, AcademicCalendar, Complaint, StudentRating, Exam, ExamResult, HallTicket, DisciplinaryAction, Document, CommunicationLog
from datetime import datetime, timedelta, time
import random
from werkzeug.security import generate_password_hash

def seed():
    print("Seeding database with dummy data...")

    # --- Create tables if they don't exist ---
    db.create_all()
    print("Database tables ensured.")
    # ------------------------------------------

    # --- Users ---
    print("Creating users...")
    admin_user = User(email='admin@example.com', first_name='Admin', last_name='User', role='admin')
    admin_user.password_hash = generate_password_hash('admin123')
    db.session.add(admin_user)

    teacher_users = []
    for i in range(1, 4):
        user = User(email=f'teacher{i}@example.com', first_name=f'Teacher{i}', last_name='Prof', role='teacher')
        user.password_hash = generate_password_hash('password')
        db.session.add(user)
        teacher_users.append(user)
    db.session.commit()

    admin = Admin(user_id=User.query.filter_by(email='admin@example.com').first().id)
    db.session.add(admin)

    teachers = []
    for user in teacher_users:
        teacher = Teacher(user_id=user.id, department='Science', designation='Professor')
        db.session.add(teacher)
        teachers.append(teacher)
    db.session.commit()

    # --- Classes ---
    print("Creating classes...")
    class_a = Class(name='Class A', year=datetime.now().year, teacher_id=teachers[0].id)
    class_b = Class(name='Class B', year=datetime.now().year, teacher_id=teachers[1].id)
    db.session.add_all([class_a, class_b])
    db.session.commit()

    # --- Students ---
    print("Creating students...")
    classes = Class.query.all()
    students = []
    for i in range(1, 16):
        class_obj = random.choice(classes)
        user = User(email=f'student{i}@example.com', first_name=f'Student{i}', last_name='Learner', role='student')
        user.password_hash = generate_password_hash('password')
        db.session.add(user)
        db.session.commit()
        student = Student(user_id=user.id, roll_number=f'ROLL{i:03d}', class_id=class_obj.id, year_of_admission=datetime.now().year)
        db.session.add(student)
        students.append(student)
    db.session.commit()

    # --- Subjects ---
    print("Creating subjects...")
    subjects = []
    subject_names = ['Math', 'Science', 'English', 'History', 'Art']
    for name in subject_names:
        subject = Subject(name=name, code=name[:3].upper() + '101', description=f'Introduction to {name}')
        db.session.add(subject)
        subjects.append(subject)
    db.session.commit()

    # Assign subjects to teachers (optional, depends on your model)
    # for teacher in teachers:
    #     teacher.subjects.append(random.choice(subjects))
    # db.session.commit()

    # --- Timetable (Simple) ---
    print("Creating timetable...")
    days = [0, 1, 2, 3, 4] # Monday to Friday
    start_times = [time(8,0), time(9,0), time(10,0)]
    end_times = [time(9,0), time(10,0), time(11,0)]
    rooms = ['Room 101', 'Room 102']
    for class_obj in classes:
        for day in days:
            for i in range(len(start_times)):
                timetable = Timetable(
                    class_id=class_obj.id,
                    subject_id=random.choice(subjects).id,
                    day_of_week=day,
                    start_time=start_times[i],
                    end_time=end_times[i],
                    room=random.choice(rooms)
                )
                db.session.add(timetable)
    db.session.commit()

    # --- Attendance (Sample) ---
    print("Creating attendance records...")
    for student in students:
        for _ in range(10): # 10 sample attendance records per student
            attendance_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
            subject = random.choice(subjects)
            attendance = Attendance(
                student_id=student.id,
                subject_id=subject.id,
                date=attendance_date.date(),
                status=random.choice(['present', 'absent']),
                marked_by_id=random.choice(teachers).user_id # Assuming marked_by_id is user_id
            )
            db.session.add(attendance)
    db.session.commit()

    # --- Assignments (Sample) ---
    print("Creating assignments...")
    for i in range(5):
        class_obj = random.choice(classes)
        subject = random.choice(subjects)
        assignment = Assignment(
            title=f'Assignment {i+1} for {subject.name} ({class_obj.name})',
            description='Complete tasks and submit',
            due_date=datetime.utcnow().date() + timedelta(days=random.randint(7, 14)),
            subject_id=subject.id,
            class_id=class_obj.id,
            teacher_id=random.choice(teachers).id # Use teacher_id instead of created_by_id
        )
        db.session.add(assignment)
    db.session.commit()

    # --- Assignment Submissions (Sample) ---
    print("Creating assignment submissions...")
    assignments = Assignment.query.all()
    for assignment in assignments:
        students_in_class = Student.query.filter_by(class_id=assignment.class_id).all()
        for student in students_in_class:
            if random.random() > 0.2: # 80% submission rate
                submission_date = assignment.due_date - timedelta(days=random.randint(-2, 5)) # Some late, some early
                submission = AssignmentSubmission(
                    assignment_id=assignment.id,
                    student_id=student.id,
                    submission_date=submission_date,
                    grade=random.choice(['A', 'B', 'C', 'D', 'F', None]), # Include some ungraded
                    remarks='Good effort' if random.random() > 0.5 else None,
                    file_path='path/to/file.pdf' if random.random() > 0.3 else None
                )
                db.session.add(submission)
    db.session.commit()

    # --- Appointments (Sample) ---
    print("Creating appointments...")
    for _ in range(7):
        student = random.choice(students)
        teacher = random.choice(teachers)
        appointment_date = datetime.utcnow().date() + timedelta(days=random.randint(1, 14))
        appointment_time = time(random.randint(9, 16), 0)
        appointment = Appointment(
            student_id=student.id,
            teacher_id=teacher.id,
            date=appointment_date,
            start_time=appointment_time,
            end_time=(datetime.combine(appointment_date, appointment_time) + timedelta(minutes=30)).time(),
            purpose='Academic Discussion',
            status=random.choice(['pending', 'accepted', 'rejected'])
        )
        db.session.add(appointment)
    db.session.commit()

    # --- Notifications (Sample) ---
    print("Creating notifications...")
    admin_user_id = User.query.filter_by(role='admin').first().id
    for user in User.query.all():
        if user.role != 'admin': # Send notifications from admin
            notification = Notification(
                sender_id=admin_user_id,
                recipient_id=user.id,
                title='Important Announcement',
                message='This is a test notification.',
                notification_type='announcement',
                read=random.random() > 0.5 # Some read, some unread
            )
            db.session.add(notification)
    db.session.commit()

    # --- Academic Calendar (Sample) ---
    print("Creating academic calendar events...")
    for i in range(5):
        start_date = datetime.utcnow().date() + timedelta(days=random.randint(1, 60))
        end_date = start_date + timedelta(days=random.randint(0, 3))
        event = AcademicCalendar(
            title=f'Event {i+1}',
            description='Details about the event.',
            start_date=start_date,
            end_date=end_date,
            event_type=random.choice(['holiday', 'exam', 'event']),
            created_by_id=admin_user_id
        )
        db.session.add(event)
    db.session.commit()

    # --- Complaints (Sample) ---
    print("Creating complaints...")
    for _ in range(5):
        student = random.choice(students)
        complaint_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
        status = random.choice(['open', 'in_progress', 'resolved'])
        resolved_at = datetime.utcnow() if status == 'resolved' else None
        resolution_notes = 'Discussed with teacher.' if status == 'resolved' else None
        resolved_by_id = admin_user_id if status == 'resolved' else None
        
        complaint = Complaint(
            student_id=student.id,
            title='Issue with course material',
            description='The provided notes are unclear.',
            status=status,
            created_at=complaint_date,
            resolved_at=resolved_at,
            resolution_notes=resolution_notes,
            assigned_to_id=None  # or set to a user id if you want
        )
        db.session.add(complaint)
    db.session.commit()

    # --- Student Ratings (Sample) ---
    print("Creating student ratings...")
    for _ in range(10):
        student = random.choice(students)
        teacher = random.choice(teachers)
        subject = random.choice(subjects)
        rating = StudentRating(
            student_id=student.id,
            teacher_id=teacher.id,
            subject_id=subject.id,
            rating=random.randint(1, 5),
            comments='Great class' if random.random() > 0.5 else 'Needs improvement',
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 60))
        )
        db.session.add(rating)
    db.session.commit()

    # --- Exams (Sample) ---
    print("Creating exams...")
    for i in range(3):
        class_obj = random.choice(classes)
        subject = random.choice(subjects)
        exam_date = datetime.utcnow().date() + timedelta(days=random.randint(15, 45))
        exam = Exam(
            title=f'{subject.name} Exam {i+1}',
            subject_id=subject.id,
            class_id=class_obj.id,
            exam_date=exam_date,
            start_time=time(9, 0),
            end_time=time(12, 0),
            room=random.choice(rooms),
            total_marks=100,
            passing_marks=40,
            created_by_id=admin_user_id
        )
        db.session.add(exam)
    db.session.commit()

    # --- Exam Results (Sample) ---
    print("Creating exam results...")
    exams = Exam.query.all()
    for exam in exams:
        students_in_class = Student.query.filter_by(class_id=exam.class_id).all()
        for student in students_in_class:
            if random.random() > 0.1: # 90% have results
                marks_obtained = random.randint(0, exam.total_marks)
                if marks_obtained >= 90: grade = 'A'
                elif marks_obtained >= 80: grade = 'B'
                elif marks_obtained >= 70: grade = 'C'
                elif marks_obtained >= 60: grade = 'D'
                else: grade = 'F'
                result = ExamResult(
                    exam_id=exam.id,
                    student_id=student.id,
                    marks_obtained=marks_obtained,
                    grade=grade,
                    remarks='Passed' if marks_obtained >= exam.passing_marks else 'Failed'
                )
                db.session.add(result)
    db.session.commit()

    # --- Hall Tickets (Sample) ---
    print("Creating hall tickets...")
    exams = Exam.query.all()
    for exam in exams:
        students_in_class = Student.query.filter_by(class_id=exam.class_id).all()
        for i, student in enumerate(students_in_class):
            hall_ticket = HallTicket(
                exam_id=exam.id,
                student_id=student.id,
                ticket_number=f"HT{exam.id:04d}{student.id:04d}",
                room_number=exam.room,
                seat_number=f"{i+1:03d}"
            )
            db.session.add(hall_ticket)
    db.session.commit()

    # --- Disciplinary Actions (Sample) ---
    print("Creating disciplinary actions...")
    for _ in range(3):
        student = random.choice(students)
        issued_at = datetime.utcnow() - timedelta(days=random.randint(1, 90))
        action_type = random.choice(['warning', 'suspension'])
        valid_until = issued_at.date() + timedelta(days=random.randint(7, 30)) if action_type == 'suspension' else None
        action = DisciplinaryAction(
            student_id=student.id,
            action_type=action_type,
            description='Violation of conduct policy.',
            issued_at=issued_at,
            valid_until=valid_until,
            related_incidents='Tardiness',
            issued_by_id=admin_user_id
        )
        db.session.add(action)
    db.session.commit()

    # --- Documents (Sample) ---
    print("Creating documents...")
    for _ in range(5):
        student = random.choice(students)
        verified = random.random() > 0.3  # Some unverified
        document = Document(
            student_id=student.id,
            file_path='uploads/certificates/certificate.pdf',
            document_type=random.choice(['transcript', 'certificate', 'ID']),
            uploaded_at=datetime.utcnow() - timedelta(days=random.randint(1, 120)),
            verified=verified,
            verified_by_id=admin_user_id if verified else None,
            verification_date=datetime.utcnow() if verified else None,
            verification_notes='Matches records.' if verified else None
        )
        db.session.add(document)
    db.session.commit()

    # --- Communication Logs (Sample) ---
    print("Creating communication logs...")
    all_users = User.query.all()
    for _ in range(10):
        sender = random.choice(all_users)
        recipient = random.choice(all_users)
        if sender.id != recipient.id:
            communication = CommunicationLog(
                sender_id=sender.id,
                recipient_id=recipient.id,
                communication_type=random.choice(['email', 'sms', 'in-app']),
                subject='Follow up',
                message='Regarding your recent query.',
                sent_at=datetime.utcnow() - timedelta(days=random.randint(1, 90))
            )
            db.session.add(communication)
    db.session.commit()


    print("Database seeding complete.")

if __name__ == '__main__':
    with app.app_context():
        seed() 