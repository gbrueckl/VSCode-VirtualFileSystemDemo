import * as vscode from 'vscode';

import { Buffer } from '@env/buffer';

export const VIRTUALFS_SCHEME: string = "virtualfs";

export class VirtualFileSystemProvider implements vscode.FileSystemProvider, vscode.Disposable {
	private static cache: Map<string, Buffer> = new Map<string, Buffer>();

	constructor() { }

	public static async register(context: vscode.ExtensionContext) {
		const fsp = new VirtualFileSystemProvider()
		context.subscriptions.push(vscode.workspace.registerFileSystemProvider(VIRTUALFS_SCHEME, fsp, { isCaseSensitive: false }));
	}

	public static async createTempFile(path: string, content: Uint8Array): Promise<vscode.Uri> {
		let uri = vscode.Uri.parse(`${VIRTUALFS_SCHEME}:///${path}`);
		VirtualFileSystemProvider.cache.set(uri.toString(), Buffer.from(content));

		return uri;
	}

	public static async uploadFile(): Promise<vscode.Uri> {
		const file = await vscode.window.showOpenDialog({
			"title": "Upload file", 
			"canSelectFiles": false, 
			"canSelectFolders": false, 
			"canSelectMany": false, 
			"openLabel": 
			"Upload"
		});

		if (!file) {
			return null;
		}

		const uri = file[0];
		const fileName = uri.path.split("/").pop().toLowerCase();

		const newUri = this.createTempFile(fileName, await vscode.workspace.fs.readFile(uri));

		vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer", vscode.Uri.parse(`${VIRTUALFS_SCHEME}:///`));
	}

	public static async showInExplorer() {
		const uri = vscode.Uri.parse(`${VIRTUALFS_SCHEME}:///`);
		await vscode.commands.executeCommand("vscode.openFolder", uri, true);
	}

	public static async delete(uri: vscode.Uri) {
		VirtualFileSystemProvider.cache.delete(uri.toString());
	}

	// -- manage file metadata
	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		const item = VirtualFileSystemProvider.cache.get(uri.toString());

		if (item) {
			return {
				type: vscode.FileType.File,
				size: 0,
				mtime: null,
				ctime: null
			}
		}

		if(uri.path === "/") {
			return {
				type: vscode.FileType.Directory,
				size: 0,
				mtime: null,
				ctime: null
			}
		}

		throw vscode.FileSystemError.FileNotFound(uri);
	}

	async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		const result: [string, vscode.FileType][] = [];

		if(uri.path === "/") {
			for (const key of VirtualFileSystemProvider.cache.keys()) {
				const item = VirtualFileSystemProvider.cache.get(key);
				result.push([key, item ? vscode.FileType.File : vscode.FileType.Unknown]);
			}
		}

		return result;
	}

	// --- manage file contents
	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		const item = VirtualFileSystemProvider.cache.get(uri.toString().toLowerCase());

		return item;
	}

	async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
		throw vscode.FileSystemError.NoPermissions(`This file is read-only!`);
	}

	// --- manage files/folders

	async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): Promise<void> {
		throw vscode.FileSystemError.NoPermissions(`This file is read-only!`);
	}

	async delete(uri: vscode.Uri): Promise<void> {
		throw vscode.FileSystemError.NoPermissions(`This file is read-only!`);
	}

	async createDirectory(uri: vscode.Uri): Promise<void> {
		throw vscode.FileSystemError.NoPermissions(`This file is read-only!`);
	}

	/*
		async copy(source: vscode.Uri, destination: vscode.Uri, options: { readonly overwrite: boolean; }): Promise<void> {
			
		}
		*/

	// --- manage file events
	private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	private _bufferedEvents: vscode.FileChangeEvent[] = [];
	private _fireSoonHandle?: NodeJS.Timer;

	readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;

	watch(_resource: vscode.Uri): vscode.Disposable {
		// ignore, fires for all changes...
		return new vscode.Disposable(() => { });
	}

	public _fireSoon(...events: vscode.FileChangeEvent[]): void {
		this._bufferedEvents.push(...events);

		if (this._fireSoonHandle) {
			clearTimeout(this._fireSoonHandle);
		}

		this._fireSoonHandle = setTimeout(() => {
			this._emitter.fire(this._bufferedEvents);
			this._bufferedEvents.length = 0;
		}, 5);
	}

	public async dispose(): Promise<void> {
		this._emitter.dispose();
	}
}
