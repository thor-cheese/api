from .models import auction_created, treasuries
from api import db
from sqlalchemy import func
# from flask_sqlalchemy import text






def listEvents_resolver(obj, info,limit,offset):
    print(obj)
    print(info)
    print('hi')


# select *  from public."marketplace_events"

    # qq= 'limit {} offset {};'.format(limit, offset)
    # print(marketplace_events.query.limit(10).all())
    # events = [event.to_dict() for event in marketplace_events.query.limit(10).all()]
    # print(events)
    # for record in db.engine.execute(qq):
    #     # print(record)
    #     print(record.to_dict())

    if limit>100:
        limit = 100


    try:
        print(1)

        # print('events:')

        events = [event.to_dict() for event in treasury.query.limit(limit).offset(offset).all()]



        # print('events:')


        payload = {
            "success": True,
            "errors":['none'],
            "events": events
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    print(payload)
    return payload


def getTreasury_resolver(obj, info,date):

    # def object_as_dict(obj):
    #     return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs}

    print('treasury')

    try:


        date_record = [event.to_dict() for event in treasuries.query.filter_by(datestring=date).all()]


        maxDate = treasuries.query.order_by(treasuries.date.desc()).first()

        minDate = treasuries.query.order_by(treasuries.date.asc()).first().datestring

        record = None
        if date_record is None:
            record = maxDate.to_dict()
        else:
            record = [event.to_dict() for event in treasuries.query.filter_by(datestring=maxDate.datestring).all()]



        payload = {
            "success": True,
            "errors":['none'],
            'mindate':minDate,
            'maxdate': maxDate.datestring,
            "events": record
        }

    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }


    print()
    print('Payload')
    print(payload)
    print()
    return payload





#     # Write your query or mutation here
# query Query($getLimit:Int!,$getOffset:Int!){
#   getTreasury(limit:$getLimit,offset:$getOffset){
#     success
# 		errors
# 		events{
#       id
#       blockNumber
#       date
#       ticker
#       value
#       tokens
#     }
#   }
#
# }
#
# {
#
#   "getLimit": 100,
#   "getOffset":0
#
# }
