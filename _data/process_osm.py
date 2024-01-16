import os
import osmium
import json
import boto3
from dotenv import load_dotenv
import progressbar


def latlon2ne(lat, lon):
    lat_round = round(lat)
    lon_round = round(lon)
    lat_direction = 's' if lat_round < 0 else 'n'
    lat_abs = str(abs(lat_round)).zfill(2)
    lon_direction = 'w' if lon_round < 0 else 'e'
    lon_abs = str(abs(lon_round)).zfill(3)
    return lat_direction + lat_abs + lon_direction + lon_abs


class CounterHandler(osmium.SimpleHandler):
    def __init__(self):
        osmium.SimpleHandler.__init__(self)
        self.num_nodes = 0
        self.files = {}

    def node(self, n):
        self.num_nodes += 1
        tile = latlon2ne(n.location.lat, n.location.lon)
        if tile not in self.files:
            self.files[tile] = []
        self.files[tile].append({
            "location": {"lat": n.location.lat, "lon": n.location.lon},
            "id": n.id,
            "tags": dict(n.tags)
        })


if __name__ == '__main__':
    load_dotenv()
    s3 = boto3.client(
        service_name="s3",
        endpoint_url='https://' + os.environ.get("CF_Account_ID") + '.r2.cloudflarestorage.com',
        aws_access_key_id=os.environ.get("CF_Access_ID"),
        aws_secret_access_key=os.environ.get("CF_Access_Key"),
        region_name=os.environ.get("CF_Region"),  # Must be one of: wnam, enam, weur, eeur, apac, auto
    )
    h = CounterHandler()

    h.apply_file("/home/adam/filtered.osm.pbf")

    print("Number of nodes: %d" % h.num_nodes)
    i = 0
    bar = progressbar.ProgressBar(maxval=len(h.files))
    bar.start()
    for file in h.files:
        s3.put_object(
            Bucket=os.environ.get("CF_Bucket"),
            Body=json.dumps(h.files[file]),
            Key="markers/" + file + ".json"
        )
        i += 1
        bar.update(i)

