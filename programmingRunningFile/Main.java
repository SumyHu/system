import java.util.Scanner;
public class Main {
public int sum(int a, int b){
return a+b;
}

public static void main(String args[]) {
System.out.println("请输入：");
Scanner in1 = new Scanner(System.in);
System.out.println("2：");
Scanner in2 = new Scanner(System.in);
int n1 = in1.nextInt();
int n2 = in2.nextInt();
Main m = new Main();
System.out.println(m.sum(n1, n2));
}
}