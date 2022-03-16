from .models import auction_created, treasuries
from api import db
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
        print(obj)
        print(info)
        print('hi')
        print(2)
        events = [event.to_dict() for event in treasuries.query.limit(limit).offset(offset).all()]

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
