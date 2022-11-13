// 测试代码2-1
#include<vector>
#include<stdio.h>
#include<unistd.h>
#include<stdlib.h>
#include <stddef.h>
#include <windows.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <string>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
using namespace std;
double u[3][3],C[3][3],K[3],stress[3][3];
double a,xi,chi;
int IND;
void setting_input(){a=0.5;xi=1.0;chi=0.0; K[0]=1.0;K[1]=0.0;K[2]=0.0;u[0][0]=-1.0;u[1][1]=-2.0;u[2][2]=-1.0;} //data for demo (演示数据).
#include "Y.c" //All Equations! 所有计算公式。
