import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('158.69.207.209', 666))
message = "5cf744cb5ddc7a2190be19c8|12000|asdabc|130"
s.sendall(message.encode())
msg = s.recv(1024)
s.close()
print(msg.decode("utf-8"))
#import pymongo
#from bson.objectid import ObjectId
# try:
#     client = pymongo.MongoClient("mongodb+srv://admin_claro123:admin_claro123@cluster0-nrqhe.mongodb.net/test?retryWrites=true&w=majority")
#     db = client.claro
#     efectyClient = db.clients.find_one({"_id": ObjectId("5cf744cb5ddc7a2190be19c8") })
#     if(efectyClient):
#         send = efectyClient["name"] + efectyClient["lastname"] + "|"+ efectyClient["iden"]+ "|10000|130"
#         print(send)
#     else:
#         print("error al encontrar el cliente")
# except:
#     print("error con el cliente")




# try:
#     client = pymongo.MongoClient("mongodb+srv://admin_claro123:admin_claro123@cluster0-nrqhe.mongodb.net/test?retryWrites=true&w=majority")
#     db = client.claro
#     myquery = {"_id": ObjectId("5cf744cb5ddc7a2190be19c8") }
#     newvalues = { "$set": { "saldo_actual": "Canyon 123", "comision_actual":  } }
#     efectyClient = db.clients.update_one()
#     if(efectyClient):
#         send = efectyClient["name"] + efectyClient["lastname"] + "|"+ efectyClient["iden"]+ "|10000|130"
#         print(send)
#     else:
#         print("error al encontrar el cliente")
# except:
#     print("error con el cliente")

