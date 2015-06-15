describe("Mathematic Functions", function() {
   
    it("abs(`-7.25`)", function() {
        var $GL = "return (abs(`-7.25`)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(7.25);
    });

    it("acos(`0.5`)", function() {
        var $GL = "return (acos(`0.5`)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(1.0471975511965979);
    });


    it("asin(`0.5`)", function() {
        var $GL = "return (asin(`0.5`)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(0.5235987755982989);
    });


    it("atan(2)", function() {
        var $GL = "return (atan(2)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(1.1071487177940904);
    });
    

    it("atan2(8, 4)", function() {
        var $GL = "return (atan2(8, 4)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(1.446441332248135);
    });


    it("ceil(`1.4`)", function() {
        var $GL = "return (ceil(`1.4`)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(2);
    });

    it("cos(3)", function() {
        var $GL = "return (cos(3)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(-0.9899924966004446);
    });

    it("exp(1)", function() {
        var $GL = "return (exp(1)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(2.718281828459045);
    });

    it("floor(`1.6`)", function() {
        var $GL = "return (floor(`1.6`)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(1);
    });

    it("log(2)", function() {
        var $GL = "return (log(2)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(0.6931471805599453);
    });

    it("max(5, 10)", function() {
        var $GL = "return (max(5, 10)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(10);
    });

    it("min(5,10)", function() {
        var $GL = "return (min(5,10)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(5);
    });

    it("pow(4, 3)", function() {
        var $GL = "return (pow(4, 3)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(64);
    });

    it("round(`2.5`)", function() {
        var $GL = "return (round(`2.5`)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(3);
    });

    it("sin(3)", function() {
        var $GL = "return (sin(3)).\r\n";
        expect(execute(gl.parse($GL))).toEqual(0.141120008059867);
    });

});
