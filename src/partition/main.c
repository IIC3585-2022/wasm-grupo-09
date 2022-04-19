#include <stdio.h>
#include <stdlib.h>

typedef struct subset
{
    int len;
    int* subset;
} Subset;


typedef struct answer
{
    int partition;
    Subset** subset;
    char* msg;
} Answer;


int accumulate(int* S, int n){
    int sum = 0;
    for(int i = 0; i<n; i++){
        sum += S[i];
    }
    return sum;
};

void clean(Answer* ans){
    for(int i=0; i<3; i++){
        free(ans->subset[i]->subset);
        free(ans->subset[i]);
    }
    free(ans->subset);
    free(ans);

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

Answer* partition(int* S, int n){
    int sum = accumulate(S, n);
    int arr[n];
    int result = (n>=3) && !(sum%3) && isSubsetExists(S, n-1, (int) sum/3, (int) sum/3,(int) sum/3, arr);
    Answer* answer = malloc(sizeof(Answer));
    answer->partition = result;
    answer->subset = calloc(3, sizeof(Subset*));
    if(result){
        for(int i=0; i<3; i++){
            answer->subset[i] = malloc(sizeof(Subset));
            for(int j =0; j<n; j++){
                if(arr[j]== i+1){
                    answer->subset[i]->len++;
                }
            }
            answer->subset[i]->subset = calloc(answer->subset[i]->len, sizeof(int));
            
            int k=0;
            for(int j =0; j<n; j++){
                if(arr[j]== i+1){
                    answer->subset[i]->subset[k] = S[j];
                    k++;
                   
                }

            }
            
        }  
       
    }
    answer->msg = "3-partition of set is not posible\n";
    return answer;

    

}


int main(){
    int S[7] = {7, 3, 2, 1, 5,4, 8};
    int size_arr = (int) sizeof(S);
    int n  = (int) (size_arr/sizeof(S[0]));
    Answer* ans = partition(S,n);
    if(!ans->partition){
        printf("%s", ans->msg);

    }else{
        for(int i = 0; i<3; i++){
            printf("partition %i:", i);
            for(int j=0; j<ans->subset[i]->len; j++){
                printf(" %i ",ans->subset[i]->subset[j]);
            }
            printf("\n");
        }
        clean(ans);
    }
    
    return 0;

}
