DECLARE
	i NUMBER;
	sumx NUMBER;
BEGIN 
	i := 0;
	sumx := 0;
	FOR i IN 1..100 LOOP
		sumx := sumx+i;
	END LOOP;
	dbms_output.put_line('1到100之间的整数和为' || TO_CHAR(sumx));
END