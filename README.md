# VSCode-VirtualFileSystemDemo
A sample VSCode extension to demonstrate Virtual File System

Implements the following `commands` which can be called via the command palette:

```
{
	"category": "Virtual FileSystem",
	"command": "VirtualFS.uploadFile",
	"title": "Upload File to VirtualFS"
},
{
	"category": "Virtual FileSystem",
	"command": "VirtualFS.showInExplorer",
	"title": "Show VirtualFS in Explorer"
},
{
	"category": "Virtual FileSystem",
	"command": "VirtualFS.delete",
	"title": "Delete file in VirtualFS"
}
```

If you add `virtualfs:/` to your workspace as in the example below, it will prompt you to upload a file whenever the workspace is loaded:

````
{
	"folders": [
		{
			"path": "."
		},
		{
			"uri": "virtualfs://",
			"name": "VirtualFS"
		}
	],
	"settings": {}
}
```
