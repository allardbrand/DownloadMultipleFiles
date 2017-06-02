# Multi-file download

## Description
Download multiple files from your Mendix application in one click

## Demo
See [https://multi-filedownload.mxapps.io/](https://multi-filedownload.mxapps.io/) for an example

Username: demo 

Password: Demo123!

## Features and limitations
*	Download a list of files based on a microflow
*	Download a list of files based on an XPath

## Configuration
1.	Add the Multi-file download widget within a context on one of your pages
2.	Configure the OpenTab widget to either use a microflow or XPath as data source
3.	In both cases, make sure to configure the return entity (the entity of the files you want to download)
4.  Optionally set the option 'auto-start download' in order to automatically start the download when the page is opened

## Credits
This widget is based on the [multi-download](https://github.com/sindresorhus/multi-download) lib of [Sindre Sorhus](https://github.com/sindresorhus)
