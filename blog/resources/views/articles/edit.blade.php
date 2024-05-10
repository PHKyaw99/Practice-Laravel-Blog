@extends("layouts.app")

@section("content")

    <div class="container w-75">
        @if($errors->any())
            @foreach($errors->all() as $error)
            <script type="module">
                import {Eggy} from "/js/eggy.js";
                Eggy({
                    title: "",
                    message: '{{ $error }}',
                    type: 'info'
                })
            </script>
            @endforeach
        @endif
        
        <form method="post">
            @csrf
            <div class="mb-3">
                <label>Title</label>
                <input type="text" name="title" value="{{ $article->title }}" class="form-control">
            </div>
            <div class="mb-3">
                <label>body</label>
                <textarea name="body" class="form-control">{{ $article->body }}</textarea>
            </div>
            <div class="mb-3">
                <label>category</label>
                <select name="category_id" class="form-select">
                    @foreach($categories as $category)
                    <option value="{{ $category->id }}" @selected($article->category_id == $category->id)>{{ $category->name }}</option>
                    @endforeach
                </select>
            </div>
            <input type="submit" value="Confirm" class="btn btn-primary">
        </form>
    </div>
    
@endsection