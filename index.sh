#!/bin/bash
echo 'Directories: <br><br>' > dist/index.html
find dist -mindepth 2 -type d | sed s/$/\<br\>/ | sed s#dist/## | sort >> dist/index.html
echo '<br> Files: <br><br>' >> dist/index.html
find dist -mindepth 2 -type f | sed s/$/\<br\>/ | sed s#dist/## | sort >> dist/index.html

