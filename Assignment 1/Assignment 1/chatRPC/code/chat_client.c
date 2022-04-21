/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "chat.h"


void
chat_prog_1(char *host)
{
	CLIENT *clnt;
	Message  *result_1;
	Message  chat_1_arg;

#ifndef	DEBUG
	clnt = clnt_create (host, CHAT_PROG, CHAT_VERS, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */
	printf("client ->> ");
	fgets(chat_1_arg.message, 100, stdin);
	
	// printf("%s\n" , chat_1_arg.message);
	result_1 = chat_1(&chat_1_arg, clnt);
	if (result_1 == (Message *) NULL) {
		clnt_perror (clnt, "call failed");
	}else{
		printf("server >> %s\n", result_1->message);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}


int
main (int argc, char *argv[])
{
	char *host;

	if (argc < 2) {
		printf ("usage: %s server_host\n", argv[0]);
		exit (1);
	}
	host = argv[1];
	printf("press ctrl + c to exit\n");
	while(1){
		chat_prog_1 (host);
	}
	
exit (0);
}