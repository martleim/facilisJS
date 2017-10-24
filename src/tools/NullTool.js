package view.tools 
{
	
	/**
	 * ...
	 * @author Martin Leiva
	 */
	public class NullTool extends Tool{
		public function NullTool() {			
		}
		
		override public function unselectTool():void {
			ToolManager.getInstance().setWorkingTool(null);
		}
		
		override public function draw():void{
		}
		
	}
	
}