import {
    ElementRef, Inject, Input, Output,
    EventEmitter, OnInit, OnDestroy
}                                from "@angular/core";

import { FroalaEditorDirective } from "angular2-froala-wysiwyg";
import { Md5 }                   from "ts-md5/dist/md5";

export class FroalaBfDirectives extends FroalaEditorDirective implements OnInit, OnDestroy {

    @Input()
    set insertImages(images) {
        if (images) {
            this.addImagesToEditor(images);
        }
    }

    @Input()
    set featuredImageInitId(id) {
        if (id) {
            this.featuredImage = id;
        }
    }

    @Input()
    set urlSuffix(suffix) {
        if (suffix) {
            this.thumbImageUrlSuffix = suffix;
        }
    }

    @Input()
    set addLoaderToImage(uniqueId) {
        if (uniqueId && this.editedImageUniqueId == uniqueId) {
            this.startLoader();
        }
    }

    @Input()
    set finishEditedImageUpload(data) {
        if (data && data.success) {
            this.finishImageEdit(data);
        } else if (data) {
            this.failedImageEdit();
        }
    }

    @Input() thumbImageUrlPrefix;
    @Input() thumbImageUrlSuffix;
    @Input() isInitRun: boolean = false;

    @Output() startAddPictureEvent = new EventEmitter<any>();
    @Output() startAddPinEvent = new EventEmitter<any>();
    @Output() featuredImageChangedEvent = new EventEmitter<any>();
    @Output() contentValidationChangedEvent = new EventEmitter<any>();
    @Output() startEditImageEvent = new EventEmitter<any>();

    private froalaEditorBf: any;
    private froalaElementBf: any;

    private featuredImage: any = 3;
    private imagesWaitingToInsert = [];
    private lastInsertedImgIndex = 0;
    private imageCount = 0;

    private globalClickListener: any;

    private editedImageUniqueId;
    private isImageEdit: boolean = false;

    constructor(@Inject(ElementRef) elementRef: ElementRef) {
        super(elementRef);

        this.froalaEditorBf = (<any>$['FroalaEditor']);
        this.createFroalaCustomButtons();
        this.setFroalaExternalEventListeners();
    }

    ngOnInit() {
        super.ngOnInit();

        this.froalaElementBf = (<any>$('.froala-editor-element'));
        this.setFroalaEventListeners();
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        document.removeEventListener('click', this.globalClickListener);
    }

    private createFroalaCustomButtons() {
        let self = this;

        this.froalaEditorBf.DefineIconTemplate('icn_design', '<i class="icn icn-[NAME]"></i>');

        this.froalaEditorBf.DefineIcon('imageAlt', {NAME: 'attributes', template: 'icn_design'});

        this.froalaEditorBf.DefineIcon('addPostImage', {NAME: 'image'});
        this.froalaEditorBf.RegisterCommand('addPostImage', {
            title: 'Add image from gallery',
            focus: false,
            undo: false,
            refreshAfterCallback: false,
            callback: function () {
                self.startAddPictureEvent.emit();
            }
        });

        this.froalaEditorBf.DefineIcon('removePostImage', {NAME: 'trash'});
        this.froalaEditorBf.RegisterCommand('removePostImage', {
            title: 'Remove image',
            focus: false,
            undo: false,
            refreshAfterCallback: false,
            callback: function () {
                let $img = this.image.get();
                let isFeatured = $img.hasClass('featured-image') || $img.attr('data-id') == self.featuredImage? true : false;
                this.image.remove($img);
                if (!isFeatured) {
                    return;
                }

                let newFeatured = document.querySelector('.post-image');
                if (newFeatured) {
                    newFeatured.classList.add('featured-image');
                    self.featuredImage = newFeatured.getAttribute("data-id");
                    self.feturedIdChanged();
                } else {
                    self.featuredImage = 3;
                    self.feturedIdChanged();
                }
                self.contentValidationChanged();
            }
        });

        this.froalaEditorBf.DefineIcon('preferPostImage', {NAME: 'prefer', template: 'icn_design'});
        this.froalaEditorBf.RegisterCommand('preferPostImage', {
            title: 'Prefer image',
            focus: false,
            undo: false,
            refreshAfterCallback: true,
            callback: function () {
                let $img = this.image.get();
                if ($img.hasClass('featured-image') && $img.attr('data-id') == self.featuredImage) {
                    return;
                }

                let featuredImage = document.querySelector('.featured-image');
                featuredImage.classList.remove('featured-image');

                self.featuredImage = $img.attr('data-id');
                $img.addClass('featured-image');
                self.feturedIdChanged();
            },
            refresh: function ($btn) {
                let $img = this.image.get();
                if ($img.hasClass('featured-image') && $img.attr('data-id') == self.featuredImage) {
                    $btn.css('background', '#D6D6D6');
                } else {
                    $btn.css('background', 'initial');
                }
            },
        });

        this.froalaEditorBf.DefineIcon('alignPostImageLeft', {NAME: 'align-left'});
        this.froalaEditorBf.RegisterCommand('alignPostImageLeft', {
            title: 'Align Left',
            focus: false,
            undo: false,
            refreshAfterCallback: true,
            callback: function () {
                let $img = this.image.get();
                if ($img.hasClass('fr-fi-ftp')) {
                    $img.removeClass('fr-fi-ftp');
                }
                this.image.align('left');
            },
            refresh: function ($btn) {
                let $img = this.image.get();
                if ($img.hasClass('fr-fil')) {
                    $btn.css('background', '#D6D6D6');
                } else {
                    $btn.css('background', 'initial');
                }
            },
        });

        this.froalaEditorBf.DefineIcon('alignPostImageCenter', {NAME: 'align-center'});
        this.froalaEditorBf.RegisterCommand('alignPostImageCenter', {
            title: 'Align Center',
            focus: false,
            undo: false,
            refreshAfterCallback: true,
            callback: function () {
                let $img = this.image.get();
                if ($img.hasClass('fr-fi-ftp')) {
                    $img.removeClass('fr-fi-ftp');
                }
                this.image.align('center');
            },
            refresh: function ($btn) {
                let $img = this.image.get();
                if (!$img.hasClass('fr-fil') && !$img.hasClass('fr-fir') && !$img.hasClass('fr-fi-ftp')) {
                    $btn.css('background', '#D6D6D6');
                } else {
                    $btn.css('background', 'initial');
                }
            },
        });

        this.froalaEditorBf.DefineIcon('alignPostImageRight', {NAME: 'align-right'});
        this.froalaEditorBf.RegisterCommand('alignPostImageRight', {
            title: 'Align Right',
            focus: false,
            undo: false,
            refreshAfterCallback: true,
            callback: function () {
                let $img = this.image.get();
                if ($img.hasClass('fr-fi-ftp')) {
                    $img.removeClass('fr-fi-ftp');
                }
                this.image.align('right');
            },
            refresh: function ($btn) {
                let $img = this.image.get();
                if ($img.hasClass('fr-fir')) {
                    $btn.css('background', '#D6D6D6');
                } else {
                    $btn.css('background', 'initial');
                }
            },
        });

        this.froalaEditorBf.DefineIcon('alignPostImageFitToPage', {NAME: 'align-justify'});
        this.froalaEditorBf.RegisterCommand('alignPostImageFitToPage', {
            title: 'Fit to page',
            focus: false,
            undo: false,
            refreshAfterCallback: true,
            callback: function () {
                let $img = this.image.get();
                $img.addClass('fr-fi-ftp')
                this.image.align('justify');
            },
            refresh: function ($btn) {
                let $img = this.image.get();
                if ($img.hasClass('fr-fi-ftp')) {
                    $btn.css('background', '#D6D6D6');
                } else {
                    $btn.css('background', 'initial');
                }
            },
        });

        this.froalaEditorBf.DefineIcon('addPinToImage', {NAME: 'map-pin'});
        this.froalaEditorBf.RegisterCommand('addPinToImage', {
            title: 'Add pin to image',
            focus: false,
            undo: false,
            refreshAfterCallback: false,
            callback: function () {
                let $img = this.image.get();
                self.startAddPinEvent.emit({'uniqueId': $img.attr('data-unique-id'), 'src': $img.attr('src')});
            }
        });

        this.froalaEditorBf.DefineIcon('editImage', {NAME: 'edit'});
        this.froalaEditorBf.RegisterCommand('editImage', {
            title: 'Edit image',
            focus: false,
            undo: false,
            refreshAfterCallback: false,
            callback: function () {
                if (!self.isImageEdit) {
                    let $img = this.image.get();
                    self.editedImageUniqueId = $img.attr('data-unique-id');
                    self.startEditImageEvent.emit({'uniqueId': $img.attr('data-unique-id'), 'src': $img.attr('src')});
                }
            }
        });
    }

    private setFroalaEventListeners() {
        let self = this;

        this.froalaElementBf.on('froalaEditor.image.inserted', function(e, editor, $img, response) {
            if (!self.isImageEdit) {
                $img.addClass('post-image');
                if (self.featuredImage == 3) {
                    self.featuredImage = $img.attr('data-id');
                    $img.addClass('featured-image');
                    self.feturedIdChanged();
                }
                $img.addClass('fr-fi-ftp');
                if (self.imagesWaitingToInsert[self.lastInsertedImgIndex+1]) {
                    self.froalaElementBf.froalaEditor(
                        'image.insert',
                        self.imagesWaitingToInsert[self.lastInsertedImgIndex+1].src,
                        true,
                        {
                            'id': self.imagesWaitingToInsert[self.lastInsertedImgIndex+1].id,
                            'unique-id': self.imagesWaitingToInsert[self.lastInsertedImgIndex+1].id + '-' + self.imageCount
                        }
                    );
                    self.imageCount++;
                    self.lastInsertedImgIndex = self.lastInsertedImgIndex + 1;
                }
            }
            self.isImageEdit = false;
            self.contentValidationChanged(true);
        });
        this.froalaElementBf.on('froalaEditor.paste.afterCleanup', function(e, editor, clipboard_html) {
            let elem = document.createElement("div");
            elem.innerHTML = clipboard_html;
            let oldImageElements = elem.getElementsByTagName('img');
            let newImageElements = self.changeImageSrc(oldImageElements);
            for (let i = 0; i < oldImageElements.length; i++) {
                if (self.featuredImage == 3) {
                    self.featuredImage = newImageElements[i].getAttribute('data-id');
                    newImageElements[i].classList.add('featured-image');
                    self.feturedIdChanged();
                }
                newImageElements[i].classList.add('fr-fi-ftp');
                clipboard_html = clipboard_html.replace(oldImageElements[i].outerHTML, newImageElements[i].outerHTML);
            }
            return clipboard_html;
        });

        this.froalaElementBf.on('froalaEditor.contentChanged', function (e, editor) {
            if (self.isInitRun) {
                self.isInitRun = false;
            } else {
                self.contentValidationChanged();
            }
        });

        this.froalaElementBf.on('froalaEditor.keypress', function (e, editor, keypressEvent) {
            self.contentValidationChanged();
        });

        this.froalaElementBf.on('froalaEditor.video.inserted', function (e, editor, $video) {
            self.contentValidationChanged(true);
        });

        this.froalaElementBf.on('froalaEditor.image.removed', function (e, editor, $img, response) {
            let isFeatured = $img.hasClass('featured-image') || $img.attr('data-id') == self.featuredImage? true : false;
            if (!isFeatured) {
                return;
            }

            let newFeatured = document.querySelector('.post-image');
            if (newFeatured) {
                newFeatured.classList.add('featured-image');
                self.featuredImage = newFeatured.getAttribute("data-id");
                self.feturedIdChanged();
            } else {
                self.featuredImage = 3;
                self.feturedIdChanged();
            }
            self.contentValidationChanged();
        });
    }

    private setFroalaExternalEventListeners() {
        let self = this;

        this.globalClickListener = function(event) {
            self.froalaQuickInsert(event);
        };

        document.addEventListener('click', this.globalClickListener);
    }

    private froalaQuickInsert(event) {
        if (!event.target
            || event.target.getAttribute('name') == undefined
            || event.target.getAttribute('name') == null
        ) {
            return;
        }

        let name = event.target.getAttribute('name');
        if (name.indexOf('quickInsertImage') !== -1) {
            event.stopPropagation();
            event.preventDefault();

            this.startAddPictureEvent.emit();
        }
    }

    private addImagesToEditor(response) {
        this.imagesWaitingToInsert = response;
        this.froalaElementBf.froalaEditor(
            'image.insert',
            response[0].src,
            true,
            {
                'id': response[0].id,
                'unique-id': response[0].id + '-' + this.imageCount
            }
        );
        this.imageCount++;
    }

    private feturedIdChanged() {
        this.featuredImageChangedEvent.emit(this.featuredImage);
    }

    private changeImageSrc(images) {
        let newImageElements = [];
        for(var i=0; i < images.length; i++){
            let btoaHash = btoa(images[i].src);
            let newUrl = this.thumbImageUrlPrefix + btoaHash.replace('+', '-').replace('/', '_') + this.thumbImageUrlSuffix;

            let tmpId = Md5.hashStr(images[i].src);
            let tmpElement = images[i].cloneNode(true);
            tmpElement.src = newUrl;
            tmpElement.setAttribute('data-id', tmpId);
            tmpElement.setAttribute('data-unique-id', tmpId + '-' + this.imageCount);
            this.imageCount++;
            newImageElements[i] = tmpElement;
        }
        return newImageElements;
    }

    private contentValidationChanged(isMediaChanged = false) {
        this.contentValidationChangedEvent.emit({'mediaChanged': isMediaChanged});
    }

    private startLoader() {
        this.isImageEdit = true;
        let $img = $('img[data-unique-id="'+ this.editedImageUniqueId +'"]');
        $img.attr('contenteditable', 'false');
        let offsetTop = $img.offset().top - $img.parent().offset().top - $img.parent().scrollTop() + ($img.height() / 2);
        let offsetLeft = $img.offset().left - $img.parent().offset().left + ($img.width() / 2);

        $img.after('<img class="image_preloader" style="top: ' + offsetTop + 'px; left: ' + offsetLeft + 'px;" contenteditable="false" src="assets/images/loading-bar.gif" />');
    }

    private finishLoader() {
        let loader = document.querySelector('.image_preloader');
        loader.remove();
        this.editedImageUniqueId = null;
    }

    private finishImageEdit(data) {
        let $img = $('img[data-unique-id="'+ this.editedImageUniqueId +'"]');
        $img.removeAttr('contenteditable');
        let ids = this.editedImageUniqueId.split("-");
        if (this.featuredImage == ids[0]) {
            this.featuredImage = data.id;
            this.feturedIdChanged();
        }
        this.froalaElementBf.froalaEditor('image.insert', data.src, true, {'id': data.id}, $img);
        this.finishLoader();
    }

    private failedImageEdit() {
        this.isImageEdit = false;
        let $img = $('img[data-unique-id="'+ this.editedImageUniqueId +'"]');
        $img.removeAttr('contenteditable');
        this.finishLoader();
    }
}
