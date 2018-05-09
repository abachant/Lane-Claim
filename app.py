import PIL.Image
import PIL.ExifTags

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
print (gpsinfo)
