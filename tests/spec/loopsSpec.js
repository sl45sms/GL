describe("Loops Tests", function() {
   
    it("while test", function() {
        var $GL = '$a<-(10), while($a>1) -> $a<-($a-1). ,return($a).\r\n';
        expect(execute(gl.parse($GL))).toEqual(1);
    });
    
});
