from app import db, Aircrafts
from datetime import datetime, timedelta
from sqlalchemy import desc, func


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



# db.session.query(Aircrafts.id,func.max(Aircrafts.time)).filter(Aircrafts.origin_country == 'Brazil').filter(Aircraft.time).count()

# db.session.query(Aircrafts.id).filter(Aircrafts.time == func.max(Aircrafts.time)).count()


current_timestamp = db.session.query(Aircrafts.time).order_by(desc(Aircrafts.id)).first()
db.session.query(Aircrafts.id).filter(Aircrafts.origin_country == 'Brazil').filter(Aircrafts.time == current_timestamp[0]).count()

current_timestamp = db.session.query(Aircrafts.time).order_by(desc(Aircrafts.id)).first()
db.session.query(Aircrafts.id).filter(Aircrafts.origin_country == 'United States').filter(Aircrafts.time == current_timestamp[0]).count()