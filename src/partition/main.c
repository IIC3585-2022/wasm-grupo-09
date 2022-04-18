#include <stdio.h>
#include <stdlib.h>

int len(int* arr){
    int size_arr = (int) sizeof(arr);
    printf("arr size %i\n", size_arr);
    int len  = (int) (size_arr/sizeof(arr[0]));
    return len;
};
int accumulate(int* S, int n){
    int sum = 0;
    for(int i = 0; i<n; i++){
        sum += S[i];
    }
    return sum;
};

// codigo obtenido de: https://www.techiedelight.com/3-partition-problem-extended-print-all-partitions/
int isSubsetExists(int* S, int n, int a, int b, int c, int* arr){
    if(a==0 && b==0 && c==0){
        return 1;
    }
    if(n<0){
        return 0;
    }
    //case 1: the current item becomes part of the first subset
    int A = 0;
    if(a - S[n] >= 0){
        arr[n]=1;
        A = isSubsetExists(S, n-1, a-S[n], b, c, arr);
    }
    //case 2: the current item becomes part of the second subset
    int B = 0;
    if(!A && (b-S[n]>=0)){
        arr[n]=2;
        B = isSubsetExists(S, n-1, a, b-S[n], c, arr);
    }
    //case 3: the current item becomes part of the third subset
    int C = 0;
    if((!A && !B) && (c-S[n] >= 0)){
        arr[n]=3;
        C = isSubsetExists(S, n-1, a, b, c-S[n], arr);
    }
    //return true if we get a solution
    return A || B || C;
};

int partition(int* S, int n){
    
    int sum = accumulate(S, n);
    int arr[n];
    int result = (n>=3) && !(sum%3) && isSubsetExists(S, n-1, (int) sum/3, (int) sum/3,(int) sum/3, arr);
    if(!result){
        printf("3-partition of set is not posible\n");
        return 0;
    }
    for(int i=0; i<3; i++){
        printf("Partition %i:", i);
        for(int j =0; j<n; j++){
            if(arr[j]== i+1){
                printf(" %i", S[j]);
            }
        }
        printf("\n");


    }
    return 1;
    

}


int main(){
    int S[7] = {7, 3, 2, 1, 5, 4, 8};
    int size_arr = (int) sizeof(S);
    printf("arr size %i\n", size_arr);
    int n  = (int) (size_arr/sizeof(S[0]));
   
    printf("%i\n", n);
    partition(S,n);
    return 0;

}
