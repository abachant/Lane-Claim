import PIL.Image
import PIL.ExifTags
import pyrebase


config = {
    "apiKey": "AIzaSyCs5jBiHX_nzPmzmOPlsA2lf9o6EdS9goo",
    "authDomain": "lane-claim.firebaseapp.com",
    "databaseURL": "https://lane-claim.firebaseio.com",
    "projectId": "lane-claim",
    "storageBucket": "lane-claim.appspot.com",
    "messagingSenderId": "532354359258"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

img = PIL.Image.open('IMG.jpg')

exif_data = img._getexif()
exif = {
    PIL.ExifTags.TAGS[k]: v
    for k, v in img._getexif().items()
    if k in PIL.ExifTags.TAGS
}

gpsinfo = {}
for key in exif['GPSInfo'].keys():
    decode = PIL.ExifTags.GPSTAGS.get(key,key)
    gpsinfo[decode] = exif['GPSInfo'][key]


"""
convert_to_degrees() and get_lat_lon() were written by maxbellec and can be
viewed at https://gist.github.com/maxbellec/dbb60d136565e3c4b805931f5aad2c6d
"""

get_float = lambda x: float(x[0]) / float(x[1])

def convert_to_degrees(value):
    d = get_float(value[0])
    m = get_float(value[1])
    s = get_float(value[2])
    return d + (m / 60.0) + (s / 3600.0)

def get_lat_lon(info):
    try:
        gps_latitude = info[34853][2]
        gps_latitude_ref = info[34853][1]
        gps_longitude = info[34853][4]
        gps_longitude_ref = info[34853][3]
        lat = convert_to_degrees(gps_latitude)
        if gps_latitude_ref != "N":
            lat *= -1

        lon = convert_to_degrees(gps_longitude)
        if gps_longitude_ref != "E":
            lon *= -1
        return lat, lon
    except KeyError:
        return None



photo = {"GPS": get_lat_lon(exif_data), "License": {"Number": "229YBL", "State": "WI"}}
db.child("photos").child("one").set(photo)
