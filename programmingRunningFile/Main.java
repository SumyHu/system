import java.util.Scanner;
public class Main {
public int sum(int a, int b){
return a+b;
}

public static void main(String args[]) {
System.out.println("test:");
Scanner in1 = new Scanner(System.in);
System.out.println("222222222:");
Scanner in2 = new Scanner(System.in);
Scanner in3 = new Scanner(System.in);
Scanner in4 = new Scanner(System.in);
int n1 = in1.nextInt();
System.out.println("n1:"+n1);
System.out.println(in1);
System.out.println("=================");
System.out.println(in2);
int n2 = in2.nextInt();
int n3 = in3.nextInt();
int n4 = in4.nextInt();
System.out.println("n2:"+n2);
Main m = new Main();
System.out.println(m.sum(n1, n2)+m.sum(n3, n4));
}
}