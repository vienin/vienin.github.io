# -*- coding: utf-8 -*-
import json
import shutil
import os

if __name__ == '__main__':
    index = {}
    for current, dirs, files in os.walk("."):
        if not "thumbs" in current and not current == ".":
            current = os.path.normpath(current)

            if (os.path.exists(os.path.join(current, "thumbs"))):
                shutil.rmtree(os.path.join(current, "thumbs"))
            os.makedirs(os.path.join(current, "thumbs"))

            index[current] = files
            for file in files:
                file = os.path.join(current, file)
                name =  os.path.basename(file).split('.')[0]

                print "Creating thumbnail for image %s" % file
                os.system("convert -define jpeg:size=200x200 \"%s\" "
                          "-thumbnail 200x200^ -gravity center -extent 200x200 "
                          " \"%s_tn.jpg\"" % (file, os.path.join(current, "thumbs", name)))

    open("index.json", "w").write(json.dumps(index))

