package  
{
	import documentation.*;
	import flash.events.*;
	import flash.filesystem.*;
	import flash.net.*;
	import flash.utils.Timer;
	import flash.xml.*;
	import labels.LabelManager;
	import undo.*;
	import version.VersionManager;
	import view.*;
	import view.modal.*;
	import view.window.*;
	import flash.desktop.NativeApplication;
	/**
	 * ...
	 * @author Martin Leiva
	 */
	public class Actions extends EventDispatcher{
		
		public static var fileName:String = "process.xpdl";
		public static var filePath:String = "";
		
		private var toLoad:String = "";
		
		private var savedOrLoaded:Boolean = false;
		
		//var confModal:ConfirmModal;
		var confModal:AbstractModal;
		
		public static var ON_NAME_CHANGE:String = "onNameChange";
		public static var ON_FILE_OPEN:String = "onFileOpen";
		public static var ON_FILE_SAVED:String = "onFileSaved";
		
		public var yes:Boolean = false;
		public var no:Boolean = false;
		public var cancel:Boolean = false;
		
		public function Actions() {	
		}
		
		function loadXPDLClick(e:Event) {
			loadXPDL();
		}
		public function loadXPDL() {
			openFile();
		}
		public function startGame() {
			//openFile();
		}
		public function endGame() {
			//openFile();
		}
		public function saveXPDLClick(e:Event) {
			saveXPDL();
		}
		public function saveXPDL() {
			yes = false;no = false;cancel = false;
			confModal = new FileSaveModal();
			(confModal as FileSaveModal).setSize(290, 100);
			var win:Window = WindowManager.getInstance().openModal( { width:290, height:100, centered:true, content:confModal, title:LabelManager.getInstance().getLabel("lbl_message") } );
			confModal.returns = new XMLNode(1, "returns");
			var tmp = this;
			win.addEventListener(Window.CLOSE_PRESSED, function(e:Event) {
				if((confModal as FileSaveModal).yes){
					View.complexDoc = true;
					saveFile(fileName, (confModal as FileSaveModal).extended);
					yes = true;
				}else if ((confModal as FileSaveModal).no) {
					no = true;
					tmp.dispatchEvent(new Event(Actions.ON_FILE_SAVED));
				}
			});
		}
		
		public function saveXPDLToClose() {
			yes = false;no = false;cancel = false;
			confModal = new FileSaveAllModal();
			(confModal as FileSaveAllModal).setSize(290, 100);
			var win:Window = WindowManager.getInstance().openModal( { width:290, height:100, centered:true, content:confModal, title:LabelManager.getInstance().getLabel("lbl_message") } );
			confModal.returns = new XMLNode(1, "returns");
			var tmp = this;
			win.addEventListener(Window.CLOSE_PRESSED, function(e:Event) {
				if ((confModal as FileSaveAllModal).yes) {
					yes = true;
					View.complexDoc = true;
					saveFile(fileName, (confModal as FileSaveAllModal).extended);
				}else if ((confModal as FileSaveAllModal).no) {
					no = true;
					tmp.dispatchEvent(new Event(Actions.ON_FILE_SAVED));
				}else {
					cancel = true;
					tmp.dispatchEvent(new Event(Actions.ON_FILE_SAVED));
				}
				if ((confModal as FileSaveAllModal).discard) {
					//NativeApplication.nativeApplication.exit();
					TabbedMain.exitApplication();
				}
			});
		}
		
		public function quickSave() {
			if(savedOrLoaded){
				saveXPDL();
			}
		}
		
		function newXPDLClick(e:Event) {
			newXPDL();
		}
		public function newXPDL() {
			savedOrLoaded = false;
			confModal = new ConfirmModal();
			confModal.setText(LabelManager.getInstance().getLabel("msg_reset"));
			var win:Window = WindowManager.getInstance().openModal( { width:200, height:100, centered:true, content:confModal, title:LabelManager.getInstance().getLabel("lbl_message")  } );
			confModal.setWindow(win);
			confModal.setWidth(180);
			confModal.returns = new XMLNode(1, "returns");
			var tmp = this;
			win.addEventListener(Window.CLOSE_PRESSED, function(e:Event) {
				if (confModal.wasOk()) {
					//fileName = "process.xpdl";
					fileName = "New XPDL";
					filePath = "";
					tmp.dispatchEvent(new Event(Actions.ON_NAME_CHANGE));
					clearUndoAndVersions();
					View.getInstance().clearAll();
					View.getInstance().resetMainProcessData();
					View.getInstance().unselectAll();
					AbstractMain.zoom.resetZoom();
					fileName = "process.xpdl";
				}
			});
		}
		function saveImageClick(e:Event) {
			saveImage();
		}
		public function saveImage() {
			AbstractMain.showWaitMessage();
			var timer:Timer = new Timer(500, 1);
			timer.addEventListener(TimerEvent.TIMER_COMPLETE, function(e:TimerEvent) { 
				View.getInstance().unselectAll();
				saveImageFile();
			} );
			timer.start();
			
		}
		function undoClick(e:Event) {
			undo();
		}
		function undo() {
			UndoManager.getInstance().undo();
		}
		function redoClick(e:Event) {
			redo();
		}
		function redo() {
			UndoManager.getInstance().redo();
		}
		public function generateDocumentationClick(e:MouseEvent) {
			generateDocumentation();
		}
		public function generateDocumentation() {
			var printModal:PrintModal = new PrintModal();
			WindowManager.getInstance().openModal( { width:310, height:200, centered:true, content:printModal, title:LabelManager.getInstance().getLabel("lbl_documentation") } );
		}
		public function generatePDF() {
			if (!(new PdfDocumentGenerator()).testDocumentation()) {
				AbstractMain.hideWaitMessage();
				AbstractMain.message(LabelManager.getInstance().getLabel("msg_nothingtodocument") );
				return;
			}
			var pdfModal:ConfirmModal = new ConfirmModal();
			pdfModal.setText(LabelManager.getInstance().getLabel("msg_extendedpdf") );
			var win:Window = WindowManager.getInstance().openModal( { width:150, height:100, centered:true, content:pdfModal, title:LabelManager.getInstance().getLabel("lbl_message") } );
			pdfModal.setWindow(win);
			pdfModal.setWidth(310);
			pdfModal.setOkText(LabelManager.getInstance().getLabel("lbl_extended"));
			pdfModal.setCancelText(LabelManager.getInstance().getLabel("lbl_simple") );
			pdfModal.returns = new XMLNode(1, "returns");
			win.addEventListener(Window.CLOSE_PRESSED, function(e:Event) {
				if (pdfModal.wasOk()) {
					AbstractDocumentator.EXTENDED_DOC = true;
				}else {
					AbstractDocumentator.EXTENDED_DOC = false;
				}
				AbstractMain.showWaitMessage();
				var timer:Timer = new Timer(500, 1);
				timer.addEventListener(TimerEvent.TIMER_COMPLETE, function(e:TimerEvent) { 
					(new PdfDocumentGenerator()).getDocumentation();
					//RtfDocumentGenerator.getDocumentation();
				} );
				timer.start();
			});
		}
		
		public function generateRTF() {
			if (!(new RtfDocumentGenerator()).testDocumentation()) {
				AbstractMain.hideWaitMessage();
				AbstractMain.message(LabelManager.getInstance().getLabel("msg_nothingtodocument") );
				return;
			}
			var rtfModal:ConfirmModal = new ConfirmModal();
			rtfModal.setText(LabelManager.getInstance().getLabel("msg_extendedrtf") );
			var win:Window = WindowManager.getInstance().openModal( { width:150, height:100, centered:true, content:rtfModal, title:"Message" } );
			rtfModal.setWindow(win);
			rtfModal.setWidth(310);
			rtfModal.setOkText(LabelManager.getInstance().getLabel("lbl_extended"));
			rtfModal.setCancelText(LabelManager.getInstance().getLabel("lbl_simple") );
			rtfModal.returns = new XMLNode(1, "returns");
			win.addEventListener(Window.CLOSE_PRESSED, function(e:Event) {
				if (rtfModal.wasOk()) {
					AbstractDocumentator.EXTENDED_DOC = true;
				}else {
					AbstractDocumentator.EXTENDED_DOC = false;
				}
				AbstractMain.showWaitMessage();
				var timer:Timer = new Timer(500, 1);
				timer.addEventListener(TimerEvent.TIMER_COMPLETE, function(e:TimerEvent) { 
					(new RtfDocumentGenerator()).getDocumentation();
					//RtfDocumentGenerator.getDocumentation();
				} );
				timer.start();
			});
		}
		
		public function openVersionModal(e:Event) {
			var verModal:VersionControlModal= new VersionControlModal();
			verModal.setSize(250, 300);
			var win:Window = WindowManager.getInstance().openModal( { width:250, height:300, centered:true, content:verModal, title:LabelManager.getInstance().getLabel("lbl_history") } );
			verModal.setWindow(win);
			verModal.returns = new XMLNode(1, "returns");
			win.addEventListener(Window.CLOSE_PRESSED, function(e:Event) {
				VersionManager.getInstance().resume();
			});
		}
		private var saveSimpleAfter:Boolean = false;
		function saveFile(fname:String = "", saveSimple:Boolean = false) {
			saveSimpleAfter = saveSimple;
			var xpdl:String=View.getInstance().getParsedModel();
			FileManager.getInstance().addEventListener(FileManager.FILE_SAVED, saveHandler);
			FileManager.getInstance().save(xpdl, fname);
			
		}
		
		
		function saveHandler(event:Event):void {
			FileManager.getInstance().removeEventListener(FileManager.FILE_SAVED, saveHandler);
			fileName = FileManager.getInstance().fileName;
			filePath = FileManager.getInstance().filePath;
			this.dispatchEvent(new Event(Actions.ON_NAME_CHANGE));
			savedOrLoaded = true;
			if (saveSimpleAfter) {
				saveSimpleAfter = false;
				View.complexDoc = false;
				var name = fileName;
				if (name.indexOf(".xpdl")>0) {
					name = (name.split(".xpdl")[0]);
				}
				name += "_simple.xpdl";
				saveFile(name,false);
			}else {
				this.dispatchEvent(new Event(Actions.ON_FILE_SAVED));
			}
		}
		
		function saveImageFile() {
			(new ImageGenerator()).saveImageFile();
		}
		
		private var file:File;
		function openFile() {
			var filter:FileFilter = new FileFilter("XPDL", "*.xpdl");
			try {
				FileManager.getInstance().addEventListener(FileManager.FILE_LOADED, selectHandler);
				FileManager.getInstance().open([filter]);
			}catch (error:Error)	{
				trace("Failed:", error.message);
			}
		}
		
		function selectHandler(event:Event):void {
			FileManager.getInstance().removeEventListener(FileManager.FILE_LOADED, selectHandler);
			fileName = FileManager.getInstance().fileName;
			filePath = FileManager.getInstance().filePath;
			this.dispatchEvent(new Event(Actions.ON_FILE_OPEN));
			savedOrLoaded = true;
		}
		
		private function clearUndoAndVersions() {
			UndoManager.getInstance().reset();
			VersionManager.getInstance().clear();
		}
		
		public function setFileName(str:String) {
			fileName = str;
		}
		
		public function openProcessLibrary(e:Event) {
			var url = "http://processlibrary.statum.biz/"; 
			var urlReq:URLRequest = new URLRequest(url);
			navigateToURL(urlReq);
		}
		
	}

}