from .models import auction_created, treasuries
from api import db
from sqlalchemy import func
# from flask_sqlalchemy import text

def object_to_dict(obj, found=None):
    if found is None:
        found = set()
    mapper = class_mapper(obj.__class__)
    columns = [column.key for column in mapper.columns]
    get_key_value = lambda c: (c, getattr(obj, c).isoformat()) if isinstance(getattr(obj, c), datetime) else (c, getattr(obj, c))
    out = dict(map(get_key_value, columns))
    for name, relation in mapper.relationships.items():
        if relation not in found:
            found.add(relation)
            related_obj = getattr(obj, name)
            if related_obj is not None:
                if relation.uselist:
                    out[name] = [object_to_dict(child, found) for child in related_obj]
                else:
                    out[name] = object_to_dict(related_obj, found)
    return out




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

    print('treasury')

    try:

        date_record = [event.to_dict() for event in treasuries.query.filter_by(datestring=date).all()]
        print(date_record)
        # date_record = treasuries.query.filter_by(datestring=date).first().to_dict()


        print('date_record')
        print(date_record)



        maxDate = treasuries.query.order_by(treasuries.date.desc()).first()

        print(object_to_dict(maxDate))



        minDate = treasuries.query.order_by(treasuries.date.asc()).first().date

        record = None
        if date_record is None:
            record = [object_to_dict(maxDate)]
        else:
            record = date_record



        payload = {
            "success": True,
            "errors":['none'],
            'mindate':minDate,
            'maxdate': maxDate.date,
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
