struct Message{
    char message[100];
};

program CHAT_PROG{
    version CHAT_VERS{
        Message chat(Message)=1;
    }=1;
}=0x1231231;