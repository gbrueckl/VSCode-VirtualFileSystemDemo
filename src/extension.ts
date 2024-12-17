'use strict';

import * as vscode from 'vscode';
import { VirtualFileSystemProvider, VIRTUALFS_SCHEME } from './VirtualFileSystemProvider';

export async function activate(context: vscode.ExtensionContext) {

	VirtualFileSystemProvider.register(context);

	vscode.commands.registerCommand('VirtualFS.uploadFile', (uri) => VirtualFileSystemProvider.uploadFile(uri));
	vscode.commands.registerCommand('VirtualFS.showInExplorer', () => VirtualFileSystemProvider.showInExplorer());;
	vscode.commands.registerCommand('VirtualFS.delete', (uri: vscode.Uri) => VirtualFileSystemProvider.delete(uri));

	const resourcesUri = vscode.Uri.joinPath(context.extensionUri, "resources");

	const sampleFiles = await vscode.workspace.fs.readDirectory(resourcesUri);

	let firstFile = resourcesUri;
	for (const file of sampleFiles) {
		if (file[1] == vscode.FileType.File) {
			await VirtualFileSystemProvider.copyToVirtualFileSystem(vscode.Uri.joinPath(resourcesUri, file[0]));

			if (firstFile == resourcesUri) {
				firstFile = vscode.Uri.joinPath(resourcesUri, file[0])
			}
		}
	}

	vscode.commands.registerCommand('VirtualFS.openDefaultFiles', () => vscode.commands.executeCommand("revealFileInOS", firstFile));
	

	vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer", vscode.Uri.parse(`${VIRTUALFS_SCHEME}:///`));
}