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


def getTreasury_resolver(obj, info,limit,offset):

    print('treasury')

    try:
        print('hi')
        print(2)
        print(limit)
        print(offset)
        print(obj)
        print(info)
        print(treasuries.query.limit(limit).offset(offset).all())
        print('events')
        print()
        print()


        events = [event.to_dict() for event in treasuries.query.limit(limit).offset(offset).all()]

        maxDate = treasuries.query(func.max(treasuries.date)).scalar()

        print(maxDate)



        minDate = treasuries.query.min(treasuries.date)

        print(events)
        print()
        print()

        payload = {
            "success": True,
            "errors":['none'],
            'minDate':minDate,
            'maxDate': maxDate,
            "events": events
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
