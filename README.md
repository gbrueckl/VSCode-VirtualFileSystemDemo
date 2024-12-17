# VSCode-VirtualFileSystemDemo
A sample VSCode extension to demonstrate Virtual File System.
To enable it, you need to run the command `VirtualFS.showInExplorer`. If the virtual file system is already part of your VSCode workspace, it will start automatically and load a set of sample files. These sample files can be configured by running `VirtualFS.openDefaultFiles` and copying additiona files into that folder. Directories are currently not supported.
You can also right-click any local file and choose `Upload file to VirtualFS` to make it accessible via the Virtual File System.

The following `commands` are implemented and can be called via the command palette:

```json
{
	"category": "Virtual FileSystem",
	"command": "VirtualFS.uploadFile",
	"title": "Upload file to VirtualFS"
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
},
{
	"command": "VirtualFS.openDefaultFiles",
	"title": "Open Default Files in VirtualFS",
	"category": "Virtual FileSystem"
}
```

If you add `virtualfs:/` to your workspace as in the example below, it will prompt you to upload a file whenever the workspace is loaded:

```json
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
