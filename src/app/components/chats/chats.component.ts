import { Component, effect, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';

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
  currentChat: any = null;
  chatList: any[] = [];
  filteredChatList: any[] = [];
  sub1!: Subscription;
  unsubscribe!: () => void;
  userData: any;

  constructor(private chatService: ChatService, private commonService: CommonService, public location: Location, private loader: LoaderService) {
    effect(() => {
      this.userData = this.commonService.userData()
      const sellerData = JSON.parse(sessionStorage.getItem('sellerData') || '{}') || this.commonService.sellerData();
      if (this.userData && sellerData) {
        this.currentUserId = this.userData.id;
        this.sub1 = this.chatService.getChatList(this.userData.id).subscribe(list => {
          this.chatList = list;
          this.filteredChatList = list;
        });
        if (sellerData.name) {
          this.currentChat = {
            id: sellerData.id,
            name: sellerData.name,
            avatar: sellerData.profileImage,
            // carImage: sellerData.carImage,
            // carName: sellerData.carName
          }
          this.roomId = sellerData.id < this.userData.id ? this.userData.id + '' + sellerData.id : sellerData.id + '' + this.userData.id;
        }
      }
    })
  }

  ngOnInit() {

  }

  openChat(item: any) {
    this.currentChat = item;
    this.roomId = item.id < this.userData.id ? this.userData.id + '' + item.id : item.id + '' + this.userData.id;

    this.messages = [];
    this.hasMore = true;

    this.loadMessages();
    this.listenRealTime();
    this.chatService.markAllMessagesSeen(this.userData.id, this.roomId, this.messages);
  }

  async loadMessages() {
    const result = await this.chatService.fetchMessages(this.roomId);
    this.messages = result.messages;
    this.hasMore = result.hasMore;

    console.log(this.messages);

    this.scrollToBottom();
  }

  listenRealTime() {
    if (this.unsubscribe) this.unsubscribe();
    this.unsubscribe = this.chatService.listenToMessages(this.roomId, this.currentUserId, update => {
      if (update.type === 'initial') {
        this.messages = update.data;
        this.scrollToBottom();
      } else if (update.type === 'received' || update.type === 'sent') {
        this.messages.push(update.data);
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
    this.listenRealTime();
  }

  scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTo({
        top: this.scrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  filterChatList(event: any) {
    const searchTerm = event.target.value.trim();
    if (!searchTerm) {
      this.filteredChatList = this.chatList;
    } else {
      this.filteredChatList = this.chatList.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }


  timeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  }


  ngOnDestroy() {
    if (this.unsubscribe) this.unsubscribe();
    if (this.sub1) this.sub1.unsubscribe();
  }
}
