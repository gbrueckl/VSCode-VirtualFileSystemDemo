'use strict';

import * as vscode from 'vscode';
import { VirtualFileSystemProvider } from './VirtualFileSystemProvider';

export async function activate(context: vscode.ExtensionContext) {

	VirtualFileSystemProvider.register(context);

	vscode.commands.registerCommand('VirtualFS.uploadFile', () => VirtualFileSystemProvider.uploadFile());
	vscode.commands.registerCommand('VirtualFS.showInExplorer', () => VirtualFileSystemProvider.showInExplorer());;
	vscode.commands.registerCommand('VirtualFS.delete', (uri: vscode.Uri) => VirtualFileSystemProvider.delete(uri));

	vscode.commands.executeCommand('VirtualFS.uploadFile');
}