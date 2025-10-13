import { Component, effect, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chats',
  imports: [CommonModule, FormsModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  inputValue = '';
  messages: any[] = [];
  hasMore = true;
  roomId = '';
  currentUserId = '';
  currentChat: any = {};
  chatList: any[] = [];
  filteredChatList: any[] = [];
  sub1!: Subscription;
  unsubscribe!: () => void;
  userData: any;
  searchTerm = '';

  constructor(private chatService: ChatService, private commonService: CommonService, public location:Location) {
    effect(() => {
      this.userData = this.commonService.userData()
      if (this.userData) {
        this.currentUserId = this.userData.id;
        this.sub1 = this.chatService.getChatList(this.userData.id).subscribe(list => {
          this.chatList = list;
          this.filteredChatList = list;
          this.openChat(list[0]);
        });
      }
    })
  }

  ngOnInit() {

  }

  openChat(item: any) {
    this.currentChat = item;
    this.roomId = item.id + '' + this.userData.id;

    this.messages = [];
    this.hasMore = true;

    this.loadMessages();
    this.listenRealTime();
    this.chatService.markAllMessagesSeen(this.userData.id, item.id);

  }

  async loadMessages() {
    const result = await this.chatService.fetchMessages(this.roomId, this.hasMore, this.messages);
    this.messages = result.messages;
    this.hasMore = result.hasMore;
    this.scrollToBottom();
  }

  listenRealTime() {
    if (this.unsubscribe) this.unsubscribe();
    this.unsubscribe = this.chatService.listenToMessages(this.roomId, this.currentUserId, update => {
      if (update.type === 'initial') {
        this.messages = update.data;
        this.scrollToBottom();
      } else if (update.type === 'received' || update.type === 'sent') {
        this.messages.unshift(update.data);
        this.scrollToBottom();
      } else if (update.type === 'modified') {
        const idx = this.messages.findIndex(m => m.id === update.data.id);
        if (idx !== -1) this.messages[idx] = update.data;
      } else if (update.type === 'removed') {
        this.messages = this.messages.filter(m => m.id !== update.data.id);
      }
    });
  }

  async sendMessage() {
    if (!this.inputValue.trim()) return;

    await this.chatService.sendMessage(this.inputValue, this.userData, this.currentChat, this.roomId);
    this.inputValue = '';
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTo({
        top: this.scrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  filterChatList() {
    if (!this.searchTerm) {
      this.filteredChatList = this.chatList;
    } else {
      this.filteredChatList = this.chatList.filter(c =>
        c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  ngOnDestroy() {
    if (this.unsubscribe) this.unsubscribe();
    if (this.sub1) this.sub1.unsubscribe();
  }
}
