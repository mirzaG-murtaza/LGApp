package com.example.demo.utils;

public class Node{
    private String data;
    private Node previous;
    private Node next;

    public Node(String data) {
        this.data = data;
        this.previous=null;
        this.next=null;
    }

    public void removePrevious(){
        this.previous = this.previous.previous;
    }

    public void removeNext(){
        this.next = this.next.next;
    }

    @Override
    public String toString() {
        String toString =  "Node{" +
                "data='" + data + '\'' ;
                if(previous!=null) {
                    toString += ", previous=" + previous.data;
                }
                else{
                    toString += ", previous=null";
                }
                if(next!=null) {
                    toString += ", next=" + next.data;
                }
                else{
                    toString += ", next=null";
                }

               return toString+ '}';
    }

    public Node(String data, Node previous, Node next) {
        this.data = data;
        this.previous = previous;
        this.next = next;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Node getPrevious() {
        return previous;
    }

    public void setPrevious(Node previous) {
        this.previous = previous;
    }

    public Node getNext() {
        return next;
    }

    public void setNext(Node next) {
        this.next = next;
    }
}
