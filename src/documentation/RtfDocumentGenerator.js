package  documentation
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.MovieClip;
	import flash.events.*;
	import flash.geom.Matrix;
	import flash.geom.Rectangle;
	import flash.net.FileReference;
	import flash.utils.ByteArray;
	import flash.xml.XMLNode;
	import rtf.text.*;
	import rtf.RTFDocument;
	import view.elements.AbstractElement;
	import view.View;
	import utils.LibraryManager;
	import com.formatlos.as3.lib.display.BitmapDataUnlimited;
	import com.formatlos.as3.lib.display.events.BitmapDataUnlimitedEvent;
	import com.adobe.images.JPGEncoder;
	/**
	 * ...
	 * @author Martin Leiva
	 */
	public class RtfDocumentGenerator extends AbstractDocumentator {
		
		private var rtfDoc:RTFDocument;
        public var rtfBA:ByteArray;
		
		public function RtfDocumentGenerator(){
			super();
		}
		
		public function getDocumentation():void {
			rtfDoc = new RTFDocument();
			rtfDoc.setViewscale(RTFDocument.VIEWSCALE_FULLPAGE);
            rtfDoc.setViewkind(RTFDocument.VIEWKIND_PAGELAYOUT);
			rtfDoc.getInfo().setInfoAsString(InfoGroup.INFO_AUTHOR, "Facilis BPMN");
			
			//var header:Paragraph = new Paragraph(0, 18, 9, Font.ARIAL, new TextPart("Facilis Documentation",false,null,9));
			
			var header:Paragraph = new Paragraph(0, 18, 9, Font.ARIAL);
			var table:Table = new Table();
			table.getBorders().removeBorder(5);
			
			var row:rtf.text.Row = table.getNewRow();
			var cell1:rtf.text.Cell = row.getNewCell();
			cell1.getBorders().removeBorder(10);
			var cell2:rtf.text.Cell = row.getNewCell();
			cell2.getBorders().removeBorder(10);
			cell1.addContent(new TextPart("Facilis Documentation", false, null, 9));
			if (headerImage) {
				var img:Image = new Image(headerImage);
				img.setTopLevelElement(false);
				cell2.addContent(img);
				img.setAlignment(Paragraph.ALIGN_RIGHT);
			}
			header.addText(table);
			
			header.setFontsize(9);
			header.setAlignment(Paragraph.ALIGN_JUSTIFIED);
			rtfDoc.addHeader(header);
			
			var footer:Paragraph = new Paragraph(12, 0, 8, Font.ARIAL);
			var pageNumber:TextPart = Field.FIELD_CURRENT_PAGENO as TextPart;
			pageNumber.setFontsize(9);
			footer.addText(pageNumber);
			footer.setAlignment(Paragraph.ALIGN_RIGHT);
			rtfDoc.addFooter(footer);
			
			var title:String = getTitle();
			var titParagraph:Paragraph = new Paragraph(0, 6);
			rtfDoc.addParagraph(titParagraph);
			titParagraph.setAlignment(Paragraph.ALIGN_CENTER);
			for (var n:Number = 0; n < 20;n++ ) {
				titParagraph.addText(TextPart.NEWLINE);
			}
			titParagraph.addText(new TextPart("Documentation", false, null, 25));
			titParagraph.addText(TextPart.NEWLINE);
			titParagraph.addText(TextPart.NEWLINE);
			var mpDoc:Object = getMainPoolDoc();
			if (title && title != "") {
				titParagraph.addText(new TextPart(title , false, null, 25));
				rtfDoc.getInfo().setInfoAsString(InfoGroup.INFO_TITLE, title);
			}
			if (View.getInstance().getElements().length == 0) {
				//if (mpDoc != "") {
				if (mpDoc && (mpDoc.documentation || mpDoc.events)) {
					rtfDoc.addParagraph(new NewPage());
					var dataParagraph:Paragraph = new Paragraph(0, 6);
					dataParagraph.addText(new TextPart("\n" + getElementType("back") + "es", false, TextPart.FORMAT_BOLD, 13));
					dataParagraph.addText(TextPart.NEWLINE);
					dataParagraph.addText(TextPart.NEWLINE);
					dataParagraph.setAlignment(Paragraph.ALIGN_CENTER);
					rtfDoc.addParagraph(dataParagraph);
					title = ((title && title != "" && title != "undefined")?title:"Unnamed Workflow Process");
					//generateElementDoc( { elementType:"back", name:title, documentation:mpDoc } );
					generateElementDoc( { elementType:"back", name:title, documentation:mpDoc.documentation, events:mpDoc.events } );
					saveRtf();
					return;
				}
				//Main.hideWaitMessage();
				//Main.message("Nothing To Document");
				return;
			}
			
			if(View.getInstance().getElements().length>0){
				generateImageFile();
			}else {
				saveRtf();
			}
		}
		
		
		override internal function generateDocumentationImage(img:BitmapData):void {
			var imgX:Number = 0;
			var imgY:Number = 0;
			
			var matrix:Matrix = new Matrix();
			var img2:BitmapData;
			//var rzMode:String = ResizeMode.FIT_TO_PAGE;
			
			if (img.height<900 && img.width<600) {
				imgX = 100 - ((img.width/3) / 2);
				imgY = 148 - ((img.height / 3) / 2);
				//rzMode = ResizeMode.NONE;
			}else{
				try{
					if (img.width > img.height) {
						img2 = new BitmapData(img.height, img.width, true,0xFFFFFF);
						matrix = new Matrix();
						matrix.rotate(90 * Math.PI / 180);
						matrix.translate( img.height, 0);
						img2.draw(img, matrix);
						img = img2;
					}
				}catch (e:Error) {
					matrix = new Matrix();
					if (img.width > 4000 && (img.width > img.height)) { 
						var scalex:Number = 4000 / img.width;
						img2 = new BitmapData(img.height * scalex, 4000, true);
						matrix.scale(scalex, scalex);
					}else if (img.height > 4000 && (img.width < img.height)) { 
						var scaley:Number = 4000 / img.height;
						img2 = new BitmapData(img.width * scaley, 4000, true);
						matrix.scale(scaley, scaley);
					}else {
						img2 = new BitmapData(img.height,img.width, true);
					}
					if (img.width > img.height) {
						matrix.rotate(90 * Math.PI / 180);
						matrix.translate( img2.width, 0);
					}
					img2.draw(img, matrix);
					img = img2;
				}
				if ((img.width / img.height) > 0.66) {
					var h:Number = (img.height * 200 / img.width);
					imgY = 148 - (h / 2);
				}else if ((img.width / img.height) < 0.66) {
					var w:Number = (img.width * 296 / img.height);
					imgX = 100 - (w / 2);
				}
			}
			
			rtfDoc.addParagraph(new NewPage());
			var title:String = getTitle();
			var imgParagraph:Paragraph = new Paragraph();
			imgParagraph.setSpaceAfter(0);
			imgParagraph.setSpaceBefore(90);
			imgParagraph.setAlignment(Paragraph.ALIGN_CENTER);
			rtfDoc.addParagraph(imgParagraph);
			var bdyParagraph:Paragraph;
			var rtfImg:Image = new Image(img);
			rtfImg.setAlignment(Paragraph.ALIGN_CENTER);
			if(img.width>700 || img.height>970){
				if ((img.width/img.height) > .7) {
					rtfImg.setScaleWidth(9000);
					rtfImg.setScaleHeight(Math.round((9000 * img.height) / img.width));
				}if ((img.width/img.height) < .7) {
					rtfImg.setScaleHeight(12500);
					rtfImg.setScaleWidth(Math.round((12500 * img.width) / img.height));
				}
			}
			imgParagraph.addText(rtfImg);
			var elements:Array = View.getInstance().getElements();
			var lines:Array = View.getInstance().getLineView().getElements();
			
			var elAux:Array = new Array();
			if (elements.length > 0) {
				var pageAdded:Boolean = false;
				
				var mainDoc:Object = parseMainPoolDoc();
				if (mainDoc) {
					elAux.push(mainDoc);
					rtfDoc.addParagraph(new NewPage());
					pageAdded = true;
				}
				
				elAux=elAux.concat(sortElements(elements));
				
				if (elAux.length > 0 && !pageAdded ) {
					rtfDoc.addParagraph(new NewPage());
				}
				elType = "";
				for (i = 0; i < elAux.length; i++ ) {
					if ( elAux[i].elementType != elType ) {
						elType = elAux[i].elementType;
						//pdf.addMultiCell( 180, 8, ("\n" + getElementType(elType) + ((elType=="back" || elType=="csubflow")?"es":"s") ), 0, Align.CENTER);
						var backParagraph:Paragraph = new Paragraph(0, 6);
						backParagraph.setAlignment(Paragraph.ALIGN_CENTER);
						backParagraph.addText(new TextPart(("\n" + getElementType(elType) + ((elType == "back" || elType == "csubflow")?"es":"s")), false, TextPart.FORMAT_BOLD,13));
						backParagraph.addText(TextPart.NEWLINE);
						rtfDoc.addParagraph(backParagraph);
					}
					generateElementDoc(elAux[i]);
					if (i < (elAux.length - 1)) {
						bdyParagraph = new Paragraph(0, 6);
						rtfDoc.addParagraph(bdyParagraph);
						bdyParagraph.addText(TextPart.NEWLINE);
						bdyParagraph.addText(TextPart.NEWLINE);
					}
				}
			}
			
			if (lines.length > 0) {
				i = 0;
				elAux=sortElements(lines);
				
				var elType:String = "";
				if (elAux.length>0) {
					bdyParagraph = new Paragraph(0, 6);
					rtfDoc.addParagraph(bdyParagraph);
					bdyParagraph.addText(TextPart.NEWLINE);
					bdyParagraph.addText(TextPart.NEWLINE);
				}
				for (i = 0; i < elAux.length; i++ ) {
					if ( elAux[i].elementType != elType ) {
						elType = elAux[i].elementType;
						var elTypeParagraph:Paragraph = new Paragraph(0, 6);
						elTypeParagraph.setAlignment(Paragraph.ALIGN_CENTER);
						elTypeParagraph.addText(new TextPart(("\n" + getElementType(elType) + "s" ), false, TextPart.FORMAT_BOLD,13));
						elTypeParagraph.addText(TextPart.NEWLINE);
						rtfDoc.addParagraph(elTypeParagraph);
					}
					generateElementDoc(elAux[i]);
					if(i < (elAux.length-1)){
						bdyParagraph = new Paragraph(0, 6);
						rtfDoc.addParagraph(bdyParagraph);
						bdyParagraph.addText(TextPart.NEWLINE);
						bdyParagraph.addText(TextPart.NEWLINE);
					}
				}
			}
			saveRtf();
		}
		
		
		private function saveRtf():void {
			//var ba:ByteArray = rtfDoc.save();
			var strDoc:String = rtfDoc.getDocumentAsString();
			var fileTo:FileReference = new FileReference();
			AbstractMain.hideWaitMessage();
			fileTo.addEventListener(Event.COMPLETE, function(e:Event):void {
				AbstractMain.hideWaitMessage();
				AbstractMain.message("Documentation Generated OK");
			});
			fileTo.addEventListener(Event.CANCEL, function(e:Event):void {
				AbstractMain.hideWaitMessage();
				AbstractMain.message("Documentation Not Saved");
			});
			fileTo.addEventListener(IOErrorEvent.IO_ERROR, function(e:Event):void {
				AbstractMain.hideWaitMessage();
				AbstractMain.message("Error writing the File: check if it's been closed.");
			});
			AbstractMain.showWaitMessage();
			//fileTo.save(ba, "documentation.rtf");
			fileTo.save(strDoc, "documentation.rtf");
		}
		
		public function getGeneratedRTF():RTFDocument {
			return rtfDoc;
		}
		
		/*private function getMainPoolDoc() {
			var d:XMLNode = View.getInstance().getMainProcessData();
			if (d) {
				d = d.firstChild;
				for (var i = 0; i < d.children.length; i++ ) {
					if (d.children[i].attributes.name == "documentation") {
						var doc = (d.children[i].attributes.value + "");
						if(doc!="" && doc!="undefined"){
							return doc;
						}
					}
				}
			}
			return "";
		}*/
		
		private function generateElementDoc(el:Object):void {
			if(el){
				var type:String = getElementType(el.elementType);
				if (type == "") {
					return;
				}
				//var name = getElementName(el);
				//var doc = getElementDocumentation(el);
				var name:String = el.name;
				var doc:String = el.documentation;
				var forms:String = el.forms;
				var events:String = el.events;
				var tType:String = el.type;
				var tPerformers:String = el.performers;
				
				if (((doc && doc != "" && (doc+""!="undefined")) || forms || events) && (name != "")) {
					var titParagraph:Paragraph = new Paragraph(2, 6);
					//titParagraph.setFont(new Font(Font.ARIAL));
					rtfDoc.addParagraph(titParagraph);
					titParagraph.setAlignment(Paragraph.ALIGN_LEFT);
					titParagraph.setFontsize(13);
					titParagraph.addText(new TextPart(("\n - " + (name != ""?name:"Unnamed " + type)), false, TextPart.FORMAT_BOLD, 13));
					if (tType && tType != "") {
						titParagraph.addText(TextPart.NEWLINE);
						titParagraph.addText(new TextPart(("Type: "+tType), false, null, 11));
					}
					if (tPerformers && tPerformers.length > 0) {
						for (var p:Number = 0; p < tPerformers.length; p++ ) {
							titParagraph.addText(TextPart.NEWLINE);
							titParagraph.addText(new TextPart(("Performer: " + tPerformers[p]), false, null, 11));
						}
					}
					titParagraph.addText(TextPart.NEWLINE);
					
					if (doc && doc != "") {
						var bdyParagraph:Paragraph = new Paragraph(0, 6);
						rtfDoc.addParagraph(bdyParagraph);
						bdyParagraph.setAlignment(Paragraph.ALIGN_LEFT);
						bdyParagraph.setFontsize(12);
						if (doc) {
							var lines:Array = doc.split(String.fromCharCode(13));
							for (var i:Number = 0; i < lines.length;i++ ) {
								bdyParagraph.addText(new TextPart(( "" + lines[i]  ), false, null, 11));
								bdyParagraph.addText(TextPart.NEWLINE);
							}
						}
						//bdyParagraph.addText(new TextPart(("\n - " + ("" + doc +" \n")  ),false,null,11));
					}
					if (forms) {
						drawFormGrid(forms);
					}
					if (events) {
						drawEventGrid(events);
					}
				}
			}
		}
		
		private function drawFormGrid(forms:XMLNode):void {
			if (forms.children.length > 0) {
				var tableParag:Paragraph = new Paragraph(12, 0, 8, Font.ARIAL);
				tableParag.setAlignment(Paragraph.ALIGN_LEFT);
				tableParag.addText(new TextPart("Forms", false, TextPart.FORMAT_BOLD, 13));
				tableParag.addText(TextPart.NEWLINE);
				rtfDoc.addParagraph(tableParag);
				for (var i:Number = 0; i < forms.children.length; i++ ) {
					tableParag = new Paragraph(12, 0, 8, Font.ARIAL);
					tableParag.setAlignment(Paragraph.ALIGN_LEFT);
					rtfDoc.addParagraph(tableParag);
				
					var form:XMLNode = forms.children[i];
					var name:String = form.attributes.name;
					var desc:String = form.attributes.description;
					var table:Table = new Table();
					tableParag.addText(table);
					var titRow:Row = table.getNewRow();
					//titRow.
					(addNewCell(titRow, "Name: ") as rtf.text.Cell).addContent(new TextPart(name,false,TextPart.FORMAT_BOLD));
					(titRow.getCells()[0] as rtf.text.Cell).setBackgroundColor(new Color(51, 102, 255));
					var descRow:Row = table.getNewRow();
					(addNewCell(descRow, ("Title: ")) as rtf.text.Cell).addContent(new TextPart(desc,false));
					if (form.children.length > 0 && form.children[0].nodeName!="events") {
						var docRow:Row = table.getNewRow();
						addNewCell(docRow, "Attribute Name",TextPart.FORMAT_BOLD);
						addNewCell(docRow, "Label", TextPart.FORMAT_BOLD);
						addNewCell(docRow, "Tooltip",TextPart.FORMAT_BOLD);
						addNewCell(docRow, "Field Type",TextPart.FORMAT_BOLD);
						addNewCell(docRow, "Data Type",TextPart.FORMAT_BOLD);
						addNewCell(docRow, "Regular Expression", TextPart.FORMAT_BOLD);
						addNewCell(docRow, "Grid", TextPart.FORMAT_BOLD);
						var evts:XMLNode = null;
						for (var d:Number = 0; d < form.children.length; d++ ) {
							var doc:XMLNode = form.children[d];
							if(doc.nodeName!="events"){
								docRow = table.getNewRow();
								addNewCell(docRow, doc.attributes.name);
								addNewCell(docRow, doc.attributes.description);
								addNewCell(docRow, doc.attributes.tooltip);
								addNewCell(docRow, doc.attributes.fieldtype);
								addNewCell(docRow, doc.attributes.datatype);
								addNewCell(docRow, doc.attributes.rules);
								addNewCell(docRow, doc.attributes.grid);
							}else {
								evts = form.children[d];
							}
						}
						if (evts) {
							getEventsTable(evts,table);
							//var table = getEventsTable(evts);
							//tableParag.addText(table);
						}
					}
				}
			}
		}
		
		private function drawEventGrid(events:XMLNode, title:String="Events"):void {
			if (events.children.length > 0) {
				var tableParag:Paragraph = new Paragraph(12, 0, 8, Font.ARIAL);
				tableParag.setAlignment(Paragraph.ALIGN_LEFT);
				if(title!=""){
					tableParag.addText(new TextPart(title, false, TextPart.FORMAT_BOLD, 13));
					tableParag.addText(TextPart.NEWLINE);
				}
				
				rtfDoc.addParagraph(tableParag);
				var table:Table = new Table();
				//var table:Table = getEventsTable(events);
				getEventsTable(events,table);
				tableParag.addText(table);
			}
		}
		
		private function getEventsTable(events:XMLNode, table:Table):void {
			
			var docRow:Row = table.getNewRow();
			addNewCell(docRow, "Event",TextPart.FORMAT_BOLD);
			addNewCell(docRow, "Business Class", TextPart.FORMAT_BOLD);
			addNewCell(docRow, "Business Class Description",TextPart.FORMAT_BOLD);
			for (var i:Number = 0; i < events.children.length; i++ ) {
				var event:XMLNode = events.children[i];
				var name:String = event.attributes.name;
				var className:String = event.attributes.className;
				var desc:String = event.attributes.description;
				docRow = table.getNewRow();
				addNewCell(docRow, name);
				addNewCell(docRow, className);
				addNewCell(docRow, desc);
			}
			//return table;
			
		}
		
		private function addNewCell(row:rtf.text.Row, text:String, format:String = "", fontSize:Number = 12):rtf.text.Cell{
			var cell:rtf.text.Cell = row.getNewCell();
			if (!text) {
				text = "";
			}
			cell.addContent(new TextPart(text, false, format, fontSize));
			return cell;
		}
		
	}
}