/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "chat.h"

Message *
chat_1_svc(Message *argp, struct svc_req *rqstp)
{
	static Message  result;

	/*
	 * insert server code here
	 */
	printf("client ->> %s\n" , argp->message);
	printf("server ->> ");
	fgets(result.message, 100, stdin);
	// printf("%s\n", result.message);

	return &result;
}