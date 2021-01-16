from app import db, Aircrafts
from datetime import datetime, timedelta
from sqlalchemy import desc


# Return the total of records on the table
query_result = db.session.query(Aircrafts).count()
# 15102311
# 14932737

# Return the first result the table (inplicit ordered by primary key)
query_result = db.session.query(Aircrafts.id).first()

# Return the last result the table (descinding order)
query_result = db.session.query(Aircrafts.id,Aircrafts.time).order_by(desc(Aircrafts.id)).first()

# Return the first result the table with id and time
query_result = db.session.query(Aircrafts.id,Aircrafts.time).first()

# Return the number of rows filtered by some variable
query_result = db.session.query(Aircrafts.id,Aircrafts.time).filter(Aircrafts.time == 1609372800).count()

# Delete rows based on some filtering
db.session.query(Aircrafts).filter(Aircrafts.time == 1609372800).delete()
db.session.commit()

# Offset the results by x values
db.session.query(Aircrafts.id,Aircrafts.time).offset(4315).first()

# Delete rows bellow certain threshold
# db.session.query(Aircrafts).filter(Aircrafts.time < 1609373699).delete()
# db.session.commit()

# # Delete records older than 15 days
# # db.session.query(Aircrafts.id, Aircrafts.time).filter(Aircrafts.time < round(datetime.timestamp(datetime.now() - timedelta(days=15)))).count()
# # db.session.commit()
# for jj in list(range(1,8)):
#     print('---------------------')
#     print(jj)
#     query_result = db.session.query(Aircrafts).count()
#     print(query_result)
#     db.session.query(Aircrafts.id, Aircrafts.time).filter(Aircrafts.time < round(datetime.timestamp(datetime.now() - timedelta(days=15-jj)))).delete()
#     db.session.commit()
#     query_result = db.session.query(Aircrafts).count()
#     print(query_result)
    

# Delete records older than 7 days
current_records = db.session.query(Aircrafts).count()
print(current_records)
db.session.query(Aircrafts.id, Aircrafts.time).filter(Aircrafts.time < round(datetime.timestamp(datetime.now() - timedelta(days=7)))).delete()
db.session.commit()
new_current_records = db.session.query(Aircrafts).count()
print(new_current_records)
print(f"Records deleted: {current_records - new_current_records} | Current records on db: {new_current_records}")


# # Retrieve data from database
# list_aircrafts = db.session.query(
#     Aircrafts.id,
#     Aircrafts.time
#     ).first()

# print(list_aircrafts)

# # Convert current time to unix timestamp
# now = datetime.now()
# timestamp = datetime.timestamp(now)
# list_aircrafts = db.session.query(Aircrafts.id, Aircrafts.time).filter(Aircrafts.time < timestamp).first()
# print(list_aircrafts)

# days_to_subtract = 7
# dates_delete = datetime.now() - timedelta(days=days_to_subtract)
# timestamp = round(datetime.timestamp(dates_delete))
# print(timestamp)

# db.session.query(Aircrafts.id, Aircrafts.time).filter(Aircrafts.time < timestamp).count()
# list_aircrafts = db.session.query(Aircrafts.id, Aircrafts.time).filter(Aircrafts.time < timestamp).first()

# db.session.query(Aircrafts).filter(Aircrafts.id <= list_aircrafts.id).delete()
# db.session.commit()
# print(deleted_entries)